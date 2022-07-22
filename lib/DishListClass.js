function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { generateUniqueID } from "./utilityFunctions";
export default class DishList {
  constructor() {
    _defineProperty(this, "dishes", new Array());
  }

  addDish(dish) {
    // TODO: Add check if that id is already in the array.
    const idLength = 4; // 14776336 dishes limit

    let dishAndId;

    try {
      dishAndId = {
        dish: dish,
        id: generateUniqueID(idLength, this.getIds())
      };
    } catch (_unused) {
      return false;
    }

    this.dishes.push(dishAndId);
    return true;
  }

  removeDish(id) {
    let indexToRemove = this.getIds().indexOf(id);

    if (indexToRemove < 0) {
      return false;
    }

    this.dishes.splice(indexToRemove, 1);
    return true;
  }

  getDish(id) {
    return this.dishes.find(dish => dish.id == id)["dish"];
  }

  getIds() {
    return this.dishes.map(dish => dish.id);
  }

}