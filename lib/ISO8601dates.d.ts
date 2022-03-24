export default class ISODate extends Date {
    getISODay(): number;
    getISOWeek(): number;
    static daysBetween(day1: Date | ISODate, day2: Date | ISODate): number;
}
