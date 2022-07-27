import ISODate from "./ISO8601dates.js";
import { generateUniqueID, shuffleArray } from "./utilityFunctions.js"
import Dish, { Freq, Weekdays } from "./DishClass.js"

// TODO: Ask about cookies.

export type MenuItem = {
    id: string,
    date: ISODate
}

export type DishAsObject = { 
    name: string, 
    weekdays: Weekdays, 
    dates: string[], 
    freq: Freq, 
    id: string, 
    lastSeen: string 
}

export function setCookies(consented: boolean, dishes: Dish[], menu: MenuItem[]) {
    // Sets wether cookies are activated or not based on [consented]
    if (typeof consented == "boolean") {
        // TODO: Make sure correct things happens here. IF/ELSE
        if (consented) {
            
        } else {
            
        };
        localStorage.setItem("activatedCookies", consented.toString());
        return true;
    } else {
        return false;
    }
}

export function hasActivatedCookies() {
    // Returns wether cookies are activated or not.
    return JSON.parse(localStorage.getItem("activatedCookies") as string);
}

export function loadStoredDishes() {
    // Loads dishes from localStorage and convert them to Dish objects.
    let storedDishes: DishAsObject[] | null = null; // Finish to fit rewrite
    if (JSON.parse(localStorage.getItem('activatedCookies') as string)) {
        storedDishes = JSON.parse(localStorage.getItem('dishes') as string);
    };
    // TODO: finish function to fit rewrite
}

export function loadStoredMenu(dishes: Dish[]) {
    // Returns a fully updated menu from localStorage
    let storedMenu = JSON.parse(localStorage.getItem("menu"));
    if (storedMenu == null || Object.keys(dishes).length == 0) {
        return [];
    }
    // TODO: Finish to fit new MenuClass
}