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

function closeAddDishPopup() {
  document.getElementById("addDish").classList.add("hide");
}
