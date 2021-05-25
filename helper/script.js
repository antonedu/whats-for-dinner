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
  let no_weekday_selected = true;
  for (let i = 0; i<7;i++) {
    if (weekdays[i]) {
      no_weekday_selected = false;
    }
  }
  if (no_weekday_selected) {
    newDish = new dish(name, 0, dates, freq);
  } else {
    newDish = new dish(name, weekdays, dates, freq);
  }
  if (localStorageActivated === true) {
    dishes.push(newDish);
    for (let i = 0; i < 2;i++) {
      document.getElementsByClassName('alert')[i].innerHTML = `${name} has been added to dishes`
    }
    localStorage.setItem("dishes", JSON.stringify(dishes))
  } else if (cookieAsked === false) {
    document.getElementById("askForConsent").classList.remove("hide");
  }
  else {
    for (let i = 0; i < 2;i++) {
      document.getElementsByClassName('alert')[i].innerHTML = `${name} has been added to dishes`
    }
    dishes.push(newDish);
  }
}

function showAlert(index) {
  document.getElementsByClassName('alert')[index].style.animation="";
  document.getElementsByClassName('alert')[index].style.animation="flash 2s";
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
  //document.getElementById("name").innerHTML = "";
  document.getElementById("name").value = "";
  loadDishes();
}

function toggleAddDishPopup() {
  document.getElementById("addDish").classList.toggle("hide");
  for (let i = 0; i < 2;i++) {
    document.getElementsByClassName('alert')[i].innerHTML = ""
  }
}

function showMenu() {
  document.getElementById("toggle-menu").innerHTML = "Show dishes";
  document.getElementById("menu").classList.remove("hide");
  document.getElementById("dishes").classList.add("hide");
}

function showDishes() {
  document.getElementById("toggle-menu").innerHTML = "Show menu";
  document.getElementById("menu").classList.add("hide");
  document.getElementById("dishes").classList.remove("hide");
}

function toggleMenu() {
  if (document.getElementById("toggle-menu").innerHTML === "Show dishes") {
    showDishes()
  } else {
    showMenu()
  }
}

function loadDishes() {
  document.getElementById("dishes").innerHTML = "<h1>Dishes</h1>";
  for (let i = 0; i < dishes.length; i++) {
    document.getElementById("dishes").innerHTML += `<div class="wrapper"><h1>${dishes[i].name}</h1><button onclick="removeDish(${i}); loadDishes()" class="decline">remove</button></div>`;
  }
}

function loadMenu() {
  let days_of_the_week = ["måndag","tisdag","onsdag","torsdag","fredag","lördag","söndag"];
  let currentDay = new Date().getDay() - 1;
  document.getElementById("menu").innerHTML = "<h1>Menu</h1>";
  for (let i = 0; i < menu.length; i++) {
    if (currentDay > 6) currentDay = 0;
    document.getElementById("menu").innerHTML += `<div class="wrapper"><h1>${menu[i].name}</h1><p>${days_of_the_week[currentDay]}</p></div>`;
    currentDay++;
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
    randomDishArray[i].sinceLast = 1;
  }
}

function generateMenu(amount) {
  let index;
  let currentDay = new Date().getDay()-1;
  let startLength = menu.length;
  let awwv = []; // Array with weighted values
  let weekmatchvalue;
  let no_day_specified_amount = randomDishArray.filter(dish => dish.weekdays === 0).length;
  if (currentDay < 0) {
    currentDay = 6;
  }
  for (let i = 0; i < amount; i++) {
    index = 0;
    // Algorythm for getting a new dishes
    let number_of_matching_days = randomDishArray.filter(dish => dish.weekdays[currentDay] === true).length;
    for (let j = 0; j < randomDishArray.length; j++) {
      if (randomDishArray[j].weekdays === 0) {
        weekdaymatchvalue = 2/Math.log(no_day_specified_amount+j*no_day_specified_amount);
      } else if (randomDishArray[j].weekdays[currentDay] === true) {
        weekdaymatchvalue = 3/Math.log(number_of_matching_days+j*number_of_matching_days);
      } else {
        weekdaymatchvalue = 0;
      }
      awwv[j] = {
        index: j,
        weighedvalue: randomDishArray[j].sinceLast * weekdaymatchvalue * randomDishArray[j].freq
      }
    }
    for (let j = 0; j < randomDishArray.length; j++) {
      if (awwv[j].weighedvalue > awwv[index].weighedvalue) {
        index = j;
      }
    }
    menu[i] = randomDishArray[awwv[index].index];
    for (let i = 0; i < randomDishArray.length;i++) {
      randomDishArray[i].sinceLast++;
    }
    randomDishArray[index].sinceLast = 1;
    randomDishArray.push(randomDishArray.splice(index,1)[0]);
    currentDay++;
    if (currentDay > 6) {
      currentDay = 0;
    }
  }
}
