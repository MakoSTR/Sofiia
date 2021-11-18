const priceData = require("../resources/input_files/price.json");
const taxService = require('./taxService');
const discountService = require("./discountService");
const price = priceData['Base ingredients'];
const warehouseService= require('../servises/warehousesHandler');
const orderService = require('./orderService');
const jsonData = require('../resources/input_files/data.json');
const { checkAllIngredients } = require("../helpers/helpers");

const food = jsonData.Food;
const base = jsonData['Base ingredients'];

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
        if(warehouseService.checkIsDish(ingredient).length === 0) {
            return price[ingredient] * number;
        } else {
            const userIngredients = [];
            checkAllIngredients(ingredient, userIngredients, food, base);
            const { orderSum } = orderService.sumForKeepedOrder(userIngredients, 0, 0);

            return orderSum * number;
        }
    }
}

const restaurantBudget = new RestaurantBudgetService();

module.exports = restaurantBudget;