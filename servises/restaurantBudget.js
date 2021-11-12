const priceData = require("../resources/input_files/price.json");
const taxService = require('./taxService');
const discountService = require("./discountService");
const price = priceData['Base ingredients'];

class RestaurantBudgetService {
    constructor() {
        this.restaurantBudget = 500;
    }

    getRestaurantBudget = () => {
        return this.restaurantBudget;
    }

    discount = (name, sum, discount) => {
        const sumOfDiscount = discountService.makeDiscount(name, sum, discount)
        return sumOfDiscount > 0 ? sumOfDiscount : 0
    }

    increaseRestaurantBudget = (name, sum, tax, discountValue) => {
        const discount = this.discount(name, sum, discountValue)
        const transactionTaxSum = taxService.transactionTaxSum(sum, tax);
        return this.restaurantBudget = this.restaurantBudget + (sum - transactionTaxSum - discount);
    }

    decreaseRestaurantBudget = (ingredient, number, tax) => {
        const orderAmount = this.order(ingredient, number);
        const transactionTaxSum = taxService.transactionTaxSum(orderAmount, tax);
        taxService.addAlreadyCollectedTax(orderAmount, tax);
        this.restaurantBudget -= orderAmount + transactionTaxSum;
        return { transactionTaxSum, orderAmount };
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