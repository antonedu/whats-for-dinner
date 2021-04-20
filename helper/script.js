var dishes = []
var localStorageActivated;
var cookieAsked = false;
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

function askForCookies(consented) {
  cookieAsked = true;
  if (consented === true) {
    localStorageActivated = true;
  }
  else {
    localStorageActivated = false;
  }
}

function addDish(name, weekdays, dates, freq) {
  let newDish = new dish(name, weekdays, dates, freq);
  dishes.push(newDish);
  if (localStorageActivated === true) {
    localStorage.setItem("dishes", JSON.stringify(dishes))
  }
}
