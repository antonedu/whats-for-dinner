export type Weekdays = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
export type Freq = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export default class Dish {
    name: string;
    weekdays: Weekdays;
    freq: Freq;
    // Dish class
    constructor({ name, weekdays, freq }: { name: string; weekdays: Weekdays; freq: Freq }) {
        this.name = name;
        this.weekdays = weekdays;
        this.freq = freq;
    };

    get weekdaysStr(): string {
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

    allWeekdays(): boolean {
        // If all days are true/all days are false return true else false
        if (this.weekdays.every((day, index, arr) => {
            return day == arr[0];
        })) {
            return true;
        } else {
            return false;
        };
    }

    shouldOccurOn(weekday: number): boolean {
        return this.weekdays[weekday];
    }
};