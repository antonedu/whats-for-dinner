import ISODate from "./ISO8601dates";
import { generateID } from "./utilityFunctions";

export type Weekdays = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
export type Freq = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export default class Dish {
    name: string;
    weekdays: Weekdays;
    dates?: ISODate[];
    freq: Freq;
    id: string;
    lastSeen?: ISODate;
    // Dish class
    // TODO: Add ability to create with dates as date strings
    // TODO: remove id from constructor
    constructor({ name, weekdays, dates, freq, idLength }: { name: string; weekdays: Weekdays; dates?: any[]; freq: Freq; idLength: number }) {
        this.name = name;
        this.weekdays = weekdays;
        this.dates = dates;
        this.freq = freq;
        this.id = generateID(idLength);
        this.lastSeen = new ISODate();
    };

    weekdaysStr() {
        // Returns str with active weekdays
        let weekdaysStr = "";
        const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        if (this.allWeekdays()) {
            if (this.weekdays[0] === true) {
                return "all";
            } else {
                return "any";
            }
        };
        for (let i = 0; i < 7; i++) {
            if (this.weekdays[i] == true) {
                if (weekdaysStr.length == 0) {
                    weekdaysStr += WEEKDAYS[i];
                } else {
                    weekdaysStr += ", " + WEEKDAYS[i];
                };
            };
        };
        return weekdaysStr
    };

    allWeekdays() {
        // If all days are true/all days are false return true else false
        if (this.weekdays.every((day, index, arr) => {
            return day == arr[0];
        })) {
            return true;
        } else {
            return false;
        };
    }
};