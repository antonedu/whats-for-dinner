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
    randomDishArray[i].sinceLast = 0;
  }
}

function generateMenu(amount) {
  let index;
  let currentDay = new Date().getDay()-1;
  let startLength = menu.length;
  let temp;
  let aocm; // array of current matches
  if (currentDay < 0) {
    currentDay = 6;
  }
  for (let i = 0; i < amount; i++) {
    index = -1;
    // Algorythm for getting a new dishes
    aocm = randomDishArray;
    // matchar de som inte varit på länge
    temp = aocm.filter(dish => Math.log(dish.freq*2+1)*dish.sinceLast/10 > 3*Math.log(dishes.length));
    if (temp.length != 0) {
      aocm = temp;
      temp = aocm.filter(dish => dish.weekdays[currentDay] === true);
      if (temp.length != 0) {
        // matchar de som inte varit på länge och som matchar veckodagen
        aocm = temp;
        console.log("case 1")
      } else {
        temp = aocm.filter(dish => Arry.isArray(dish.weekdays) === false);
        if (temp.length != 0) {
          // matchar de som inte varit på länge och som inte har bestämd veckodag
          aocm = temp;
          console.log("case 2")
        }
      }
    } else {
      // matchar de som inte varit på kortare tid
      temp = aocm.filter(dish => Math.log(dish.freq*2+1)*dish.sinceLast/10 > 1.3*Math.log(dishes.length));
      if (temp.length != 0) {
        aocm = temp;
        temp = aocm.filter(dish => dish.weekdays[currentDay] === true);
        if (temp.length != 0) {
          // matchar de som inte varit på kortare tid och som matchar veckodagen
          aocm = temp;
          console.log("case 3")
        } else {
          temp = aocm.filter(dish => dish.weekdays == 0);
          if (temp.length != 0) {
            // matchar de som inte varit på en kortare tid och som inte har en veckodag
            aocm = temp;
            console.log("case 4")
          }
        }
      } else {
        temp = aocm.filter(dish => dish.weekdays[currentDay] === true);
        if (temp.length != 0) {
          // matchar som har matchande veckodagar
          aocm = temp;
          console.log("case 5")
        } else {
          temp = aocm.filter(dish => dish.weekdays === 0);
          if (temp.length != 0) {
            // matchar som inte har någon veckodag
            aocm = temp;
            console.log("case 6")
          }
        }
      }
    }
    if (aocm.length != 0) {
      let i = 0;
      while (index < 0 && i < randomDishArray.length) {
        if (randomDishArray[i].name === aocm[0].name) {
          index = i;
        }
        i++;
      }
    } else {
      // matchar den första i arrayen om det inte finns andra matcher
      index = 0;
      console.log("case 7")
    }
    menu[i] = randomDishArray[index];
    for (let i = 0; i < randomDishArray.length;i++) {
      randomDishArray[i].sinceLast++;
    }
    randomDishArray[index].sinceLast = 0;
    randomDishArray.push(randomDishArray.splice(index,1)[0]);
    currentDay++;
    if (currentDay > 6) {
      currentDay = 0;
    }
  }
}
