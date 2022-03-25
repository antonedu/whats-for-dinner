// TODO: make all functions working with dates ignore hours if not needed.
// TODO: Ask about cookies.
// QUESTION: Rewrite to use hooks instead of classes?
// TODO: Make it so that lastSeenDates on stored dishes only gets updated when they are "catching up".
// Everything that is loaded after that should use copy of stored dishes.
// To add to above, when dishes are added it could be done by setting them as lastSeen the with the previous
// longest last seen date.
import ISODate from "./ISO8601dates.js";
import { generateUniqueID, shuffleArray } from "./utilityFunctions.js";
import Dish from "./DishClass.js";
export function setCookies(consented, dishes, menu) {
  // Sets wether cookies are activated or not based on [consented]
  if (typeof consented == "boolean") {
    if (consented) {
      updateStoredDishes(dishes);
      updateStoredMenu(menu);
    } else {
      localStorage.removeItem("dishes");
      localStorage.removeItem("menu");
    }

    ;
    localStorage.setItem("activatedCookies", consented.toString());
    return true;
  } else {
    return false;
  }
}
export function hasActivatedCookies() {
  // Returns wether cookies are activated or not.
  return JSON.parse(localStorage.getItem("activatedCookies"));
}
export function editDishes(dishes, name, weekdays, dates, freq, id) {
  let newDishesObj = Object.assign({}, dishes);

  if (id === null) {
    id = generateUniqueID(4, newDishesObj);
  }

  newDishesObj[id] = new Dish(name, weekdays.slice(0), dates, freq, id);
  updateStoredDishes(newDishesObj);
  return newDishesObj;
}
export function removeFromDishes(id, dishes, menu) {
  let newDishesObj = Object.assign({}, dishes);
  let newMenu = menu;

  if (newDishesObj.hasOwnProperty(id)) {
    delete newDishesObj[id];
    newMenu = regenerateMenu(newDishesObj, new ISODate());
  }

  updateStoredDishes(newDishesObj);
  updateStoredMenu(newMenu);
  return {
    dishes: newDishesObj,
    menu: newMenu
  };
}
export function loadStoredDishes() {
  // Loads dishes from localStorage and convert them to Dish objects.
  let storedDishes = null;
  let loadedDishes = Object();

  if (JSON.parse(localStorage.getItem('activatedCookies'))) {
    storedDishes = JSON.parse(localStorage.getItem('dishes'));
  }

  ;

  if (storedDishes) {
    for (let key in storedDishes) {
      loadedDishes[key] = dishFromObject(storedDishes[key]);
    }

    ;
  }

  ;
  return loadedDishes;
}

function dishFromObject(obj) {
  // Converts a dish-like object into a dish
  // Used when loading dishes from local storage
  return new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id, new ISODate(obj.lastSeen));
}

function regenerateMenu(dishes, date) {
  // Returns new dishes object with lastSeen date set to a random date between
  // today - 1 and today - today.length - 1.
  // FIXME: menu index 0 with this is latest date should be earliest
  let shuffledDishes = shuffleArray(Object.keys(dishes));
  let currentDate = new ISODate(date);
  currentDate.setDate(currentDate.getDate() - shuffledDishes.length);
  let regeneratedMenu = Array();

  for (let i = 0; i < shuffledDishes.length; i++) {
    let copiedDate = new ISODate(currentDate);
    let id = shuffledDishes[i];
    dishes[id].lastSeen = copiedDate;
    regeneratedMenu.push({
      id: id,
      date: copiedDate
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return regeneratedMenu;
}

export function generateNextX(dishes, menu, x) {
  // Generates next x items in menu and returns a menu with those added. Also
  // changes lastSeen of dishes which when used.
  if (menu.length == 0) {
    menu = regenerateMenu(dishes, new ISODate());
  }

  let newMenuArray = menu.slice();
  let d = new ISODate(newMenuArray.at(-1).date);

  for (let i = 0; i < x; i++) {
    d.setDate(d.getDate() + 1);
    let id = getNextInMenu(dishes, d);
    let copiedDate = new ISODate(d);
    dishes[id].lastSeen = new ISODate(copiedDate);
    newMenuArray.push({
      id: id,
      date: copiedDate
    });
  }

  return newMenuArray;
}

function catchUpMenu(dishes, menu) {
  // Updates lastSeen date of enough dishes for dishes to have caught up with
  // the current date. Removes dishes from menu if date has passed.
  if (menu.length == 0) {
    menu = regenerateMenu(dishes, new ISODate());
  }

  const today = new ISODate();
  const lastUpdatedDate = new ISODate(menu.at(-1).date);
  const daysSinceLastUpdate = ISODate.daysBetween(today, new ISODate(menu[0].date));
  let currentDate = new ISODate(lastUpdatedDate);
  let caughtUpMenu = menu.slice(); // let dishesButCaughtUp = Object.assign({}, dishes); not a deepclone so not useful

  for (let i = ISODate.daysBetween(today, lastUpdatedDate); i > 0; i--) {
    let id = getNextInMenu(dishes, currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
    let copiedDate = new ISODate(currentDate);
    dishes[id].lastSeen = new ISODate(copiedDate);
    caughtUpMenu.push({
      id: id,
      date: copiedDate
    });
  }

  return caughtUpMenu.slice(daysSinceLastUpdate);
}

function getNextInMenu(dishes, date) {
  // Gets which dish should be next in menu based on all dishes and a date.
  let currentBestID = null;
  let currentBestValue = -1;
  let weekday = date.getISODay();
  const numberWithNoSpecifiedDay = Object.keys(dishes).filter(dish => dishes[dish].allWeekdays()).length;
  const numberOfMatchingDay = Object.keys(dishes).filter(dish => dishes[dish].weekdays[weekday]).length;
  const numberOfTotalDays = Object.keys(dishes).length;
  const numberOfTotalSelectedDays = Object.keys(dishes).map(dish => dishes[dish].weekdays.reduce((before, x) => before + x)).reduce((before, a) => a + before);
  const numberOfTotalDaysSinceLastSeen = Object.keys(dishes).map(dish => ISODate.daysBetween(date, dishes[dish].lastSeen)).reduce((before, a) => a + before);

  for (let dish in dishes) {
    let value;

    if (dishes[dish].allWeekdays()) {
      value = 1 / numberWithNoSpecifiedDay ** 2;
    } else if (dishes[dish].weekdays[weekday]) {
      value = 3 / numberOfMatchingDay ** 2;
    } else {
      value = 0.1 / numberOfTotalDays ** 2;
    }

    value *= ISODate.daysBetween(date, dishes[dish].lastSeen) * dishes[dish].freq ** 1.2;

    if (currentBestValue < value) {
      currentBestID = dish;
      currentBestValue = value;
    }
  }

  return currentBestID;
}

export function extendMenu(dishes, menu, numberOfDays) {
  let extendedMenu = generateNextX(dishes, menu, numberOfDays);
  updateStoredMenu(extendedMenu);
  return extendedMenu;
}
export function resetMenu(dishes) {
  let updatedDishes = Object.assign({}, dishes);
  let resetMenu = regenerateMenu(updatedDishes, new ISODate());
  resetMenu = generateNextX(updatedDishes, resetMenu, 7);
  resetMenu = catchUpMenu(updatedDishes, resetMenu);
  updateStoredDishes(updatedDishes);
  updateStoredMenu(resetMenu);
  return {
    dishes: updatedDishes,
    menu: resetMenu
  };
}
export function loadStoredMenu(dishes) {
  // Returns a fully updated menu from localStorage
  let storedMenu = JSON.parse(localStorage.getItem("menu"));

  if (storedMenu == null || Object.keys(dishes).length == 0) {
    return [];
  }

  storedMenu = catchUpMenu(dishes, storedMenu);

  if (storedMenu.length < 7) {
    storedMenu = generateNextX(dishes, storedMenu, 7 - storedMenu.length);
  }

  updateStoredMenu(storedMenu);
  return storedMenu;
}
export function updateStoredDishes(dishes) {
  // Updates locale storage to include current version of dishes
  if (hasActivatedCookies()) {
    localStorage.setItem("dishes", JSON.stringify(dishes));
  }

  ;
}

function updateStoredMenu(menu) {
  // Updates menu in localStorage
  if (hasActivatedCookies()) {
    localStorage.setItem("menu", JSON.stringify(menu));
  }

  ;
}