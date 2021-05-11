var dishes = [];
var randomDishArray = [];
var menu = [];
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
  let newDish;
  let no_weekday_selected;
  for (let i = 0; i<7;i++) {
    if (weekdays[i]) {
      no_weekday_selected = false;
    }
  }
  if (no_weekday_selected) {
    newDish = new dish(name, 0, dates, 11-freq);
  } else {
    newDish = new dish(name, weekdays, dates, 11-freq);
  }
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
  addDish(name,weekdays.slice(0),dates,freq);
  loadDishes();
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
  document.getElementById("dishes").innerHTML = "<h1>Dishes</h1>";
  for (let i = 0; i < dishes.length; i++) {
    document.getElementById("dishes").innerHTML += `<div class="wrapper"><h1>${dishes[i].name}</h1><button onclick="removeDish(${i}); loadDishes()" class="decline">remove</button></div>`;
  }
}

function loadMenu() {
  document.getElementById("menu").innerHTML = "<h1>Menu</h1>";
  for (let i = 0; i < menu.length; i++) {
    document.getElementById("menu").innerHTML += `<div class="wrapper"><h1>${menu[i].name}</h1></div>`;
  }
}

function removeDish(index) {
  dishes.splice(index,1);
  if (localStorageActivated === true) {
    //dishes.push(newDish);
    localStorage.setItem("dishes", JSON.stringify(dishes))
  }
}

function randomizeDishOrder() {
  randomDishArray = dishes;
  var currentIndex = randomDishArray.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = randomDishArray[currentIndex];
    randomDishArray[currentIndex] = randomDishArray[randomIndex];
    randomDishArray[randomIndex] = temporaryValue;
  }
  for (let i = 0; i<randomDishArray.length;i++) {
    randomDishArray[i].sinceLast = randomDishArray[i].freq;
  }
}

function generateMenu(amount) {
  let index;
  let currentDay = new Date().getDay();
  let startLength = menu.length;
  currentDay--;
  if (currentDay < 0) {
    currentDay = 6;
  }
  for (let i = 0; i<amount;i++) {
    index = randomDishArray.findIndex(element => element.weekdays[currentDay] && element.sinceLast == 0);
    if (index < 0) {
      currentSinceLast = 0;
      while (index < 0 && currentSinceLast <= 10) {
        index = randomDishArray.findIndex(element => element.sinceLast == currentSinceLast && element.weekdays == 0);
        currentSinceLast++;
      }
    }
    if (index < 0) {
      index = 0;
    }
    menu[i] = randomDishArray[index];
    randomDishArray.push(randomDishArray.splice(index,1)[0]);
    for (let i = 0;i<randomDishArray.length;i++) {
      randomDishArray[i].sinceLast--;
      if (randomDishArray[i].sinceLast < 0) {
        randomDishArray[i].sinceLast = 0;
      }
    }
    randomDishArray[randomDishArray.length-1].sinceLast = randomDishArray[randomDishArray.length-1].freq;
  }
}
