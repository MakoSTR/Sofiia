const priceData = require("../resources/input_files/price.json");
const taxService = require('./taxService');
const price = priceData['Base ingredients'];

class RestaurantBudgetService {
    constructor() {
        this.restaurantBudget = 500;
    }

    getRestaurantBudget = () => {
        return this.restaurantBudget;
    }

    increaseRestaurantBudget = (sum, tax) => {
        const transactionTaxSum = taxService.transactionTaxSum(sum, tax);
        return this.restaurantBudget = this.restaurantBudget + (sum - transactionTaxSum);
    }

    addIngredients = (warehouses, ingredient, quantity) => {
        return warehouses[ingredient] = parseInt(quantity) + warehouses[ingredient];
    }

    decreaseRestaurantBudget = (ingredient, number, tax) => {
        const orderAmount = this.order(ingredient, number);
        const transactionTaxSum = taxService.transactionTaxSum(orderAmount, tax);
        taxService.addAlreadyCollectedTax(orderAmount, tax);
        this.restaurantBudget -= orderAmount - transactionTaxSum;
        return transactionTaxSum;
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