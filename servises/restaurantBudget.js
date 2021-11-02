const priceData = require("../resources/input_files/price.json");
const price = priceData['Base ingredients'];

class RestaurantBudgetService {
    constructor() {
        this.restaurantBudget = 500;
    }

    getRestaurantBudget = () => {
        return this.restaurantBudget;
    }

    increaseRestaurantBudget = (sum) => {
        return this.restaurantBudget += sum
    }

    addIngredients = (warehouses, ingredient, quantity) => {
        return warehouses[ingredient] = parseInt(quantity) + warehouses[ingredient];
    }

    decreaseRestaurantBudget = (ingredient, number) => {
        const orderAmount = this.order(ingredient, number);
            this.restaurantBudget -= orderAmount;
    }

    modifyRestaurantBudget = (sign, amount) => {
        if (sign === '=') {
            return this.restaurantBudget = amount;
        }
        if (sign === '+') {
            return this.restaurantBudget += amount;
        }
        if (sign === '-') {
            return this.restaurantBudget -= amount;
        }
    }

    order = (ingredient, number) => {
            return price[ingredient] * number;
    }
}

const restaurantBudget = new RestaurantBudgetService();

module.exports = restaurantBudget;