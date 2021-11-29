// Constants

// Variables
var dishes = new Array();

class Dish {
  // Dish class
  constructor(name, weekdays, dates, freq, id) {
    this.name = name;
    this.weekdays = weekdays;
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
};

function openAndCollapse(element) {
  // Collapses element
  element.classList.toggle("collapsed");
  element.classList.toggle("not-collapsed");
};

function loadDish(dish) {
  // Adds dish element to the end of #output-items
  name = dish.name;
  id = dish.id;
  freq = dish.freq;
  weekdays = dish.weekdaysStr;
  document.getElementById("output-items").innerHTML += `
  <div id="output-items">
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
  </div>
  `;
};

function loadDishes() {
  for (let dish in dishes) {
    loadDish(dish);
  };
};
