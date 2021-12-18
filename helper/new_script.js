// Constants

// Variables
var dishes = new Array();
var activatedCookies = false;

class Dish {
  // Dish class
  constructor(name, weekdays, dates, freq, id) {
    this.name = name;
    this.weekdays = this.replaceWeekdays(weekdays);
    this.dates = dates;
    this.freq = freq;
    this.id = id;
  };

  get weekdaysStr() {
    // Returns str with active weekdays
    let weekdaysStr = "";
    let weekdaysArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (this.weekdays == 0) {
      return "all"
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

  replaceWeekdays(weekdays) {
    // Replaces a weekdays array with sure if all 7 indexes have the same value
    let equalsFirst = (day, index, arr) => {
      return day == arr[0];
    };
    if (weekdays === 0 || weekdays.every(equalsFirst)) {
      return 0
    } else {
      return weekdays
    };
  }
};

function consentToCookies(consented) {
  // Updates local storage if consent changes
  let activated = localStorage.getItem("activatedCookies")
  if (consented === true && activated != true) {
    updateLocalStorage();
    localStorage.setItem("activatedCookies", "true");
  } else if (consented === false && activated != false) {
    localStorage.removeItem("dishes");
    localStorage.setItem("activatedCookies", "false");
  };
};

function updateLocalStorage() {
  // Updates locale storage to include current version of dishes
  localStorage.setItem("dishes", JSON.stringify(dishes));
};

function openAndCollapse(element) {
  // Collapses element
  element.classList.toggle("collapsed");
  element.classList.toggle("not-collapsed");
};

function loadDish(dish) {
  // Adds dish element to the end of #output-items
  // Creates output-item element
  let outputItem = document.createElement("div");
  outputItem.classList.add("output-item", "collapsed")
  // Appends name paragraph
  let pName = document.createElement("p");
  let name = document.createTextNode(dish.name);
  // TODO: classList add has to be new line (after create element)
  pName.appendChild(name)
  outputItem.appendChild(pName);
  // Append collapse button
  let collapseButton = document.createElement("button");
  collapseButton.classList.add("collapse");
  collapseButton.setAttribute("onclick", `openAndCollapse(document.querySelectorAll('#output-items .output-item')[${dish.id}])`);
  let collapseIcon = document.createElement("i");
  collapseIcon.classList.add("fas", "fa-chevron-down");
  collapseButton.appendChild(collapseIcon);
  outputItem.appendChild(collapseButton);
  // Appends output info
  let outputInfo = document.createElement("div");
  outputInfo.classList.add("output-info");
  let pFreq = document.createElement("p");
  let pWeekdays = document.createElement("p");
  let freq = document.createTextNode(`Frequency: ${dish.freq}`);
  let weekdays = document.createTextNode(`Weekdays: ${dish.weekdaysStr}`);
  pFreq.appendChild(freq);
  pWeekdays.appendChild(weekdays);
  outputInfo.appendChild(pFreq);
  outputInfo.appendChild(pWeekdays);
  outputItem.appendChild(outputInfo);
  // Appends remove button and wrapper
  let editButtonWrapper = document.createElement("div");
  editButtonWrapper.classList.add("output-button-wrapper");
  let editButton = document.createElement("button");
  editButton.classList.add("red", "threed-button");
  // TODO: see other button (setAttribute) when it's time
  // NOTE: remove should be an option after edit has been initialized
  let editButtonText = document.createTextNode("Remove");
  editButton.appendChild(editButtonText);
  editButtonWrapper.appendChild(editButton);
  outputItem.appendChild(editButtonWrapper);
  // Appends output-item to output-items
  document.getElementById("output-items").appendChild(outputItem);
};

function loadDishes() {
  // Loads all dishes to html
  for (let dish of dishes) {
    loadDish(dish);
  };
};

function createDish(name, weekdays, dates, freq, id) {
  // Creates a new Dish object and saves it to cookies if enabled
  dish = new Dish(name, weekdays.slice(0), dates, freq, id);
  addDish(dish);
  // TODO: add dishes array to cookies if activated
};

function addDish(dish) {
  // Adds dish to dishes array
  dishes.push(dish);
};

function dishFromObject(obj) {
  // Converts a dish-like object into a dish
  // Used when loading dishes from local storage
  try {
    addDish(new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id));
  } catch (err) {
    console.log(err);
  };
};

createDish("a", [false, false, false, false, false, false, false], null, 4, 1);
createDish("b", [true, true, true, true, true, true, true], null, 8, 2);
createDish("c", [true, false, true, true, true, true, true], null, 4, 3);

// TODO: Ask about cookies.
// TODO: Load dishes saved in local storage on load
// TODO: Edit dish function.
/* NOTE: Generate menu function which should be entirely based on dishes and
their data in menu Array. So that data from it can be shared between devices. */
