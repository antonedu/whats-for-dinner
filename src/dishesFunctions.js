import "./ISO8601dates.js";

class Dish {
    // Dish class
    constructor(name, weekdays, dates, freq, id, lastSeen = null) {
        this.name = name;
        this.weekdays = weekdays;
        this.dates = dates;
        this.freq = freq;
        this.id = id;
        this.lastSeen = lastSeen;
    };

    get weekdaysStr() {
        // Returns str with active weekdays
        let weekdaysStr = "";
        let weekdaysArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        if (this.allWeekdays()) {
            if (this.weekdays[0] === true) {
                return "all";
            } else {
                return "any";
            }
        };
        for (let i = 0; i < 7; i++) {
            if (this.weekdays[i] == true) {
                if (weekdaysStr.length == 0) {
                    weekdaysStr += weekdaysArray[i];
                } else {
                    weekdaysStr += ", " + weekdaysArray[i];
                };
            };
        };
        return weekdaysStr
    };

    allWeekdays() {
        // If all days are true/all days are false return true else false
        if (this.weekdays.every((day, index, arr) => {
            return day == arr[0];
        })) {
            return true;
        } else {
            return false;
        };
    }
};

export function setCookies(consented, dishes, menu) {
    // Sets wether cookies are activated or not based on [consented]
    if (typeof consented == "boolean") {
        if (consented) {
            updateStoredDishes(dishes);
            updateStoredMenu(menu);
        } else {
            localStorage.removeItem("dishes");
            localStorage.removeItem("menu");
        };
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
        newMenu = regenerateMenu(newDishesObj, new Date());
    }
    updateStoredDishes(newDishesObj);
    updateStoredMenu(newMenu);
    return { dishes: newDishesObj, menu: newMenu };
}

export function loadStoredDishes() {
    // Loads dishes from localStorage and convert them to Dish objects.
    let storedDishes = null;
    let loadedDishes = Object();
    if (JSON.parse(localStorage.getItem('activatedCookies'))) {
        storedDishes = JSON.parse(localStorage.getItem('dishes'));
    };
    if (storedDishes) {
        for (let key in storedDishes) {
            loadedDishes[key] = dishFromObject(storedDishes[key])
        };
    };
    return loadedDishes;
}

function dishFromObject(obj) {
    // Converts a dish-like object into a dish
    // Used when loading dishes from local storage
    return new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id, obj.lastSeen);
}

function regenerateMenu(dishes, date) {
    // Returns new dishes object with lastSeen date set to a random date between
    // today - 1 and today - today.length - 1.
    // FIXME: menu index 0 with this is latest date should be earliest
    let shuffledDishes = shuffleArray(Object.keys(dishes));
    let currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - shuffledDishes.length)
    let regeneratedMenu = Array();
    for (let i = 0; i < shuffledDishes.length; i++) {
        let copiedDate = new Date(currentDate);
        let id = shuffledDishes[i];
        dishes[id].lastSeen = copiedDate;
        regeneratedMenu.push({ id: id, date: copiedDate });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return regeneratedMenu;
}

function generateNextX(dishes, menu, x) {
    // Generates next x items in menu and returns a menu with those added. Also
    // changes lastSeen of dishes which when used.
    if (menu.length == 0) {
        menu = regenerateMenu(dishes, new Date());
    }
    let newMenuArray = menu.slice();
    let d = new Date(newMenuArray.at(-1).date);
    for (let i = 0; i < x; i++) {
        d.setDate(d.getDate() + 1);
        let id = getNextInMenu(dishes, d);
        let copiedDate = new Date(d);
        dishes[id].lastSeen = new Date(copiedDate);
        newMenuArray.push({ id: id, date: copiedDate });
    }
    return newMenuArray;
}

function catchUpMenu(dishes, menu) {
    // Updates lastSeen date of enough dishes for dishes to have caught up with
    // the current date. Removes dishes from menu if date has passed.
    if (menu.length == 0) {
        menu = regenerateMenu(dishes, new Date())
    }
    const today = new Date();
    const lastUpdatedDate = menu.at(-1).date;
    const daysSinceLastUpdate = Date.daysBetween(today, new Date(menu[0].date));
    let currentDate = new Date(lastUpdatedDate);
    let caughtUpMenu = menu.slice();
    // let dishesButCaughtUp = Object.assign({}, dishes); not a deepclone so not useful
    for (let i = Date.daysBetween(today, lastUpdatedDate); i > 0; i--) {
        let id = getNextInMenu(dishes, currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        let copiedDate = new Date(currentDate);
        dishes[id].lastSeen = new Date(copiedDate);
        caughtUpMenu.push({ id: id, date: copiedDate });
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
    const numberOfTotalDaysSinceLastSeen = Object.keys(dishes).map(dish => Date.daysBetween(date, dishes[dish].lastSeen)).reduce((before, a) => a + before);
    for (let dish in dishes) {
        let value;
        if (dishes[dish].allWeekdays()) {
            value = 1 / (numberWithNoSpecifiedDay ** 2);
        } else if (dishes[dish].weekdays[weekday]) {
            value = 3 / (numberOfMatchingDay ** 2);
        } else {
            value = 0.1 / (numberOfTotalDays ** 2);
        }
        value *= Date.daysBetween(date, dishes[dish].lastSeen) * dishes[dish].freq ** 1.2;

        if (currentBestValue < value) {
            currentBestID = dish;
            currentBestValue = value;
        }
    }
    return currentBestID;
}

export function resetMenu(dishes) {
    let updatedDishes = Object.assign({}, dishes);
    let resetMenu = regenerateMenu(updatedDishes, new Date());
    resetMenu = generateNextX(updatedDishes, resetMenu, 7);
    resetMenu = catchUpMenu(updatedDishes, resetMenu);
    updateStoredDishes(updatedDishes)
    updateStoredMenu(resetMenu);
    return {
        dishes: updatedDishes,
        menu: resetMenu,
    }
}

export function loadStoredMenu(dishes) {
    // Returns a fully updated menu from localStorage
    let storedMenu = JSON.parse(localStorage.getItem("menu"));
    if (storedMenu == null || Object.keys(dishes).length == 0) {
        return [];
    }
    storedMenu = catchUpMenu(dishes, storedMenu);
    if (storedMenu.length < 7) {
        storedMenu = generateNextX(dishes, storedMenu, 7 - storedMenu.length)
    }
    updateStoredMenu(storedMenu);
    return storedMenu;
}

function updateStoredDishes(dishes) {
    // Updates locale storage to include current version of dishes
    if (hasActivatedCookies()) {
        localStorage.setItem("dishes", JSON.stringify(dishes));
    };
}

function updateStoredMenu(menu) {
    // Updates menu in localStorage
    if (hasActivatedCookies()) {
        localStorage.setItem("menu", JSON.stringify(menu));
    };
}

function generateID(length) {
    // Generates a base62 string of length [length] to identify dishes.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function generateUniqueID(length, obj) {
    let id = null;
    let notUnique = true;
    do {
        id = generateID(length);
        if (!obj.hasOwnProperty(id)) {
            notUnique = false;
        };
    } while (notUnique);
    return id;
}

function shuffleArray(arr) {
    // Returns a shuffled array.
    let shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

  // TODO: make all functions working with dates ignore hours if not needed.
  // TODO: Ask about cookies.
  // TODO: Move functions that don't use this.setState out of classes
  // NOTE: Dates going through json will be string format but should be okay as
  // long as functions always copies dates (let x = new Date(date));
  // QUESTION: Rewrite to use hooks instead of classes?
  // QUESTION: Firefox support?
  // QUESTION: Safari support?