const priceData = require("../resources/input_files/price.json");
const taxService = require('./taxService');
const discountService = require("./discountService");
const price = priceData['Base ingredients'];
const warehouseService = require('../servises/warehousesHandler');
const orderService = require('./orderService');
const jsonData = require('../resources/input_files/data.json');
const {checkAllIngredients} = require("../helpers/helpers");
const commandConfiguration = require("../resources/input_files/commandConfiguration.json")
const data = require("../resources/input_files/data.json")

const food = jsonData.Food;
const base = jsonData['Base ingredients'];

class RestaurantBudgetService {
    constructor() {
        this.restaurantBudget = 500;
        this.volatilityForIngradients = []
        this.volatilityForReadyMeals = []
        this.array = []
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

    decreaseRestaurantBudget = (ingredient, number, tax, userIngredients) => {



        var _volatility = 0

        console.log(_volatility)

        console.log(ingredient)
        console.log(data["Base ingredients"].includes(ingredient))

        if (data["Base ingredients"].includes(ingredient)) {
            _volatility = this.getRandomFloat(commandConfiguration["min volatility for ingredients"], commandConfiguration["max volatility for ingredients"])
            // console.log("ing: " + _volatility)
            // this.volatilityForIngradients.push(_volatility)
            this.array.push(_volatility)

            console.log("ingredients")
            console.log(_volatility)

            const orderAmount = this.order(ingredient, number, userIngredients) * _volatility;
            const transactionTaxSum = taxService.transactionTaxSum(orderAmount, tax);
            taxService.addAlreadyCollectedTax(orderAmount, tax);
            this.restaurantBudget -= orderAmount + transactionTaxSum * _volatility;
            // _volatility = 0
            return {transactionTaxSum, orderAmount};
        } else {
            _volatility = this.getRandomFloat(commandConfiguration["min volatility for ready meals"], commandConfiguration["max volatility for ready meals"])
            // console.log("readyM: " + _volatility)
            // this.volatilityForReadyMeals.push(_volatility)
            this.array.push(_volatility)

            console.log("ready meals")
            console.log(_volatility)

            const orderAmount = this.order(ingredient, number, userIngredients) * _volatility;
            const transactionTaxSum = taxService.transactionTaxSum(orderAmount, tax);
            taxService.addAlreadyCollectedTax(orderAmount, tax);
            this.restaurantBudget -= orderAmount + transactionTaxSum * _volatility;
            // _volatility = 0
            return {transactionTaxSum, orderAmount};
        }
    }

    getRandomFloat(min, max) {
        var value = Math.random() * (max - min) + min;
        return parseFloat(value.toFixed(2))
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

    order = (ingredient, number, userIngredients) => {
        if (warehouseService.checkIsDish(ingredient).length === 0) {
            return price[ingredient] * number;
        } else {
            // const userIngredients = [];
            checkAllIngredients(ingredient, userIngredients, food, base);
            const {orderSum} = orderService.sumForKeepedOrder(userIngredients, 0, 0);

            return orderSum * number;
        }
    }
}

const restaurantBudget = new RestaurantBudgetService();

module.exports = restaurantBudget;