const priceData = require("../resources/input_files/price.json");
const warehousesService = require('./warehousesHandler');
const FileReader = require('./fileReader');
const price = priceData['Base ingredients'];
const warehouses = require('../resources/input_files/warehouses.json');

const fileReader = new FileReader();

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

    addIngredients = (warehouses, ingredient, number) => {
        warehouses[ingredient] += number;
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