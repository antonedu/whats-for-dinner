export default class Dish {
  // Dish class
  constructor(_ref) {
    let {
      name,
      weekdays,
      freq
    } = _ref;
    this.name = name;
    this.weekdays = weekdays;
    this.freq = freq;
  }

  get weekdaysStr() {
    // Returns str with active weekdays
    let weekdaysStr = "";
    const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    if (this.allWeekdays()) {
      // Either all weekdays are selected (all) or none (any).
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

  shouldOccurOnWeekday(weekday) {
    return this.weekdays[weekday];
  }

  occursOnXWeekdays() {
    let count = 0;
    this.weekdays.forEach(element => {
      if (element == true) {
        count++;
      }
    });
    return count;
  }

}
;