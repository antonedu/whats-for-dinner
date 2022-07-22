import { shuffleArray } from "./utilityFunctions";
export default class Menu {
  constructor(_ref) {
    let {
      dishes,
      menu
    } = _ref;

    if (dishes != undefined) {
      this.menu = this.generateMenu(dishes);
    } else if (menu != undefined) {
      this.menu = menu;
    }
  }

  generateMenu(dishes) {
    let ids = dishes.getIds();
    let menu = [[], [], [], [], [], [], []];
    const DAYS_IN_A_WEEK = 7;
    const DIVIDED_BY_1_THROUGH_7 = 420; // Smallest possible number which can be divided with 1-7 (number of days in a week)
    // Add dish occurences to menu.

    ids.forEach(id => {
      let dish = dishes.getDish(id);
      let numberOfDaysDishOccurs = dish.allWeekdays() ? DAYS_IN_A_WEEK : dish.occursOnXWeekdays(); // For each day in the week add as many occurences should exist for it to be evenly divided.

      for (let day = 0; day < DAYS_IN_A_WEEK; day++) {
        const weekday = menu[day];

        if (dish.shouldOccurOnWeekday(day)) {
          let numberOfTimesDishShouldOccur = DIVIDED_BY_1_THROUGH_7 / numberOfDaysDishOccurs * dish.freq;
          weekday.concat(new Array(numberOfTimesDishShouldOccur).fill(id));
        }
      }
    }); // shuffle order dishes occurs.

    for (let day = 0; day < DAYS_IN_A_WEEK; day++) {
      const weekday = menu[day];
      menu[day] = shuffleArray(weekday);
    }

    return menu;
  }

}