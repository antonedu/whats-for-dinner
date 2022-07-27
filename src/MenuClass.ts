import Dish from "./DishClass";
import DishList from "./DishListClass";
import ISODate from "./ISO8601dates";
import { shuffleArray } from "./utilityFunctions";

type IMenu = [string[], string[], string[], string[], string[], string[], string[]]

export default class Menu {
    menu: IMenu; 
    dishes: DishList;

    constructor({ dishes, menu }: { dishes: DishList, menu?: IMenu }) {
        if (menu == undefined) {
            this.dishes = dishes;
            this.menu = this.generateMenu(dishes);
        } else if (menu != undefined) {
            this.menu = menu;
        }
    }

    private generateMenu(dishes: DishList): IMenu {
        let ids = dishes.getIds();
        let menu: IMenu = [[], [], [], [], [], [], []];
        const DAYS_IN_A_WEEK = 7;
        const DIVIDED_BY_1_THROUGH_7 = 420; // Smallest possible number which can be divided with 1-7 (number of days in a week)
        
        // Add dish occurences to menu.
        ids.forEach(id => {
            let dish = dishes.getDish(id);
            let numberOfDaysDishOccurs = dish.allWeekdays() ? DAYS_IN_A_WEEK : dish.occursOnXWeekdays();

            // For each day in the week add as many occurences should exist for it to be evenly divided.
            for (let day = 0; day < DAYS_IN_A_WEEK; day++) {
                const weekday = menu[day];
                
                if (dish.shouldOccurOnWeekday(day)) {
                    let numberOfTimesDishShouldOccur = DIVIDED_BY_1_THROUGH_7 / numberOfDaysDishOccurs * dish.freq;
                    weekday.concat(new Array(numberOfTimesDishShouldOccur).fill(id))
                }
            }
        });

        // shuffle order dishes occurs.
        for (let day = 0; day < DAYS_IN_A_WEEK; day++) {
            const weekday = menu[day];
            menu[day] = shuffleArray(weekday);
        }

        return menu;
    } 

    getDishOn(date: ISODate): Dish {
        const NUMBER_OF_DAYS_IN_A_WEEK = 7;
        const WEEKDAY = date.getISODay();
        const dayMenu = this.menu[WEEKDAY];
        const NUMBER_OF_DISHES_ON_DAY = dayMenu.length;
        let indexToUse = Math.floor(ISODate.daysBetween(new ISODate(), date) / NUMBER_OF_DAYS_IN_A_WEEK) % NUMBER_OF_DISHES_ON_DAY;
        const DISH_ID = dayMenu[indexToUse]
        return this.dishes.getDish(DISH_ID);
    }
}