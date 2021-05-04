var dishes = []
var localStorageActivated;
var cookieAsked = false;
var weekdays = [false,false,false,false,false,false,false];
class dish {
  constructor(name, weekdays, dates, freq) {
    this.name = name;
    this.weekdays = weekdays;
    this.dates = dates;
    this.freq = freq;
  }
}

if (localStorage.getItem("dishes") === null) {
  localStorageActivated = false;
}
else {
  localStorageActivated = true;
  dishes = JSON.parse(localStorage.getItem("dishes"));
}

function consentToCookies(consented) {
  document.getElementById("askForConsent").classList.add("hide");
  cookieAsked = true;
  if (consented === true) {
    localStorageActivated = true;
  }
  else {
    localStorageActivated = false;
  }
}

function updateRangeValue() {
  let val = document.getElementById("freq").value;
  document.querySelector("#addDish label").innerHTML = val;
}

function addDish(name, weekdays, dates, freq) {
  let newDish = new dish(name, weekdays, dates, freq);
  if (localStorageActivated === true) {
    dishes.push(newDish);
    localStorage.setItem("dishes", JSON.stringify(dishes))
  } else if (cookieAsked === false) {
    document.getElementById("askForConsent").classList.remove("hide");
  }
  else {
    dishes.push(newDish);
  }
}

function updateWeekday(num) {
  if (weekdays[num] === false) {
    weekdays[num] = true;
  } else {
    weekdays[num] = false;
  }
  event.target.classList.toggle("on");
}

function getDishValues() {
  let name = document.getElementById("name").value;
  let freq = document.getElementById("freq").value;
  let dates = null;
  if (name === "") {
    name = "New dish";
  }
  addDish(name,weekdays,dates,freq);
}

function toggleAddDishPopup() {
  document.getElementById("addDish").classList.toggle("hide");
}

function generate() {

}

function toggleMenu() {
  if (document.getElementById("toggle-menu").innerHTML === "Show added dishes") {
    document.getElementById("toggle-menu").innerHTML = "Show menu";
  } else {
    document.getElementById("toggle-menu").innerHTML = "Show added dishes";
  }
  document.getElementById("menu").classList.toggle("hide");
  document.getElementById("dishes").classList.toggle("hide");
}

function loadDishes() {
  document.getElementById("dishes").innerHTML = "";
  for (let i = 0; i < dishes.length; i++) {
    document.getElementById("dishes").innerHTML += `<h1>${dishes[i].name}</h1><button onclick="removeDish(${i}); loadDishes()" class="decline">remove</button>`;
  }
}

function removeDish(index) {
  dishes.splice(index,1);
  if (localStorageActivated === true) {
    dishes.push(newDish);
    localStorage.setItem("dishes", JSON.stringify(dishes))
  }
}
