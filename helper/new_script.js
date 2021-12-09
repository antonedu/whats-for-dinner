// Constants

// Variables
var dishes = new Array();

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
    for (let i = 0; i++; i < 7) {
      if (this.weekdays[i] == true) {
        if (weekdaysStr.length == 0) {
          weekdaysStr += weekdaysArray[i];
        } else {
          weekdaysStr += ", " + weekdaysArray[i];
        };
      };
    };
  };

  replaceWeekdays(weekdays) {
    let noWeekdaySelected = true;
    let numberOfDays = 0;
    for (let i = 0; i < 7; i++) {
      if (weekdays[i]) {
        noWeekdaySelected = false;
        numberOfDays++;
      };
    };
    if (noWeekdaySelected || numberOfDays == 7) {
      return 0
    } else {
      return weekdays
    };
  };
};

function openAndCollapse(element) {
  // Collapses element
  element.classList.toggle("collapsed");
  element.classList.toggle("not-collapsed");
};

function loadDish(dish) {
  // Adds dish element to the end of #output-items
  name = dish.name;
  console.log(dish.name)
  id = dish.id;
  freq = dish.freq;
  weekdays = dish.weekdaysStr;
  // FIXME: Should use appendChild() instead
  // FIXME: Should be edit button instead of remove, from edit it should be possible to remove
  document.getElementById("output-items").innerHTML += `
    <div class="output-item collapsed">
      <p>${name}</p>
      <button class="collapse" onclick="openAndCollapse(document.querySelectorAll('#output-items .output-item')[${id}])"><i class="fas fa-chevron-down"></i></button>
      <div class="output-info">
        <p>Frequency: ${freq}</p>
        <p>Weekdays: ${weekdays}</p>
      </div>
      <div class="output-button-wrapper">
        <button class="red threed-button">
          Remove
        </button>
      </div>
    </div>
  `;
};

function loadDishes() {
  for (let dish of dishes) {
    console.log(dish)
    loadDish(dish);
  };
  console.log("done!")
};

function addDish(name, weekdays, dates, freq, id) {
  // Addes dish to dishes array
  dishes.push(new Dish(name, weekdays.slice(0), dates, freq, id));
  // TODO: add dishes array to cookies if activated
};

addDish("a", [false, false, false, false, false, false, false], null, 4, 1);

// TODO: Ask about cookies.
// TODO: Save dishes over sessions.
// TODO: Edit dish function.
// TODO: Generate menu function which should be entirely based on dishes and their data in menu Array. So that data from it can be shared between devices.
