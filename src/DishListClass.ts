import Dish from "./DishClass";
import { generateUniqueID } from "./utilityFunctions";

export default class DishList {
    // TODO: move id to this class
    dishes: Dish[] = new Array();

    addDish(dish: Dish) {
        // TODO: Add check if that id is already in the array.
        this.dishes.push(dish);
    }

    removeDish(id: string) {
        // TODO: find dish with id and remove it
    }

    getDishes(): Dish[] {
        return this.dishes.slice();
    }
}