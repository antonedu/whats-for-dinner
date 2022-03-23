export default class Dish {
  // Dish class
  constructor(name, weekdays, dates, freq, id) {
    let lastSeen = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    this.name = name;
    this.weekdays = weekdays;
    this.dates = dates;
    this.freq = freq;
    this.id = id;
    this.lastSeen = lastSeen;
  }

  get weekdaysStr() {
    // Returns str with active weekdays
    let weekdaysStr = "";
    const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    if (this.allWeekdays()) {
      if (this.weekdays[0] === true) {
        return "all";
      } else {
        return "any";
      }
    }

    ;

    for (let i = 0; i < 7; i++) {
      if (this.weekdays[i] == true) {
        if (weekdaysStr.length == 0) {
          weekdaysStr += WEEKDAYS[i];
        } else {
          weekdaysStr += ", " + WEEKDAYS[i];
        }

        ;
      }

      ;
    }

    ;
    return weekdaysStr;
  }

  allWeekdays() {
    // If all days are true/all days are false return true else false
    if (this.weekdays.every((day, index, arr) => {
      return day == arr[0];
    })) {
      return true;
    } else {
      return false;
    }

    ;
  }

}
;