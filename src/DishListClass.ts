import Dish from "./DishClass";
import { generateUniqueID } from "./utilityFunctions";

type DishWithId = {
    dish: Dish,
    id: string
}

export default class DishList {
    // TODO: move id to this class
    dishes: DishWithId[] = new Array();

    addDish(dish: Dish): boolean {
        // TODO: Add check if that id is already in the array.
        const idLength = 4; // 14776336 dishes limit
        let dishAndId: DishWithId;
        try {
            dishAndId = {
                dish: dish,
                id: generateUniqueID(idLength, this.getIds())
            }
        } catch {
            return false;
        }
        this.dishes.push(dishAndId);
        return true;
    }

    removeDish(id: string): boolean {
        let indexToRemove = this.getIds().indexOf(id);
        if (indexToRemove < 0) {
            return false;
        }
        this.dishes.splice(indexToRemove, 1);
        return true;
    }

    getDish(id: string) {
        return this.dishes.find(dish => dish.id == id)["dish"]
    }

    getIds(): string[] {
        return this.dishes.map(dish => dish.id);
    }
}