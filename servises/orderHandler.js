const jsonData = require('../resources/input_files/data.json');
const priceData = require('../resources/input_files/price.json');
const budgetData = require('../resources/input_files/budget.json');
const messageCodes = require('../resources/messageCodes.json');
const FileReader = require('./fileReader');
const restaurantBudgetService = require('./restaurantBudget');
const warehousesHandler = require('./warehousesHandler');

const fileReader = new FileReader();

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];
const price = priceData['Base ingredients'];
const budget = budgetData['Regular customer budget'];

class OrderHandler {
    constructor() {
        this.clientBudget = {};
    }
    // checkAllIngredients (recursion)
    checkAllIngredients = (order, userIngredients) => {
        const ingredients = food[order];
        for ( let i = 0; i < ingredients.length; i++ ) {
            if (base.find(item => ingredients[i] === item )) {
                userIngredients.push(ingredients[i])
            } else {
                this.checkAllIngredients(ingredients[i], userIngredients)
            }
        }
    };

    getAllergies = (name, userIngredients) => {
        const allergies = regularCustomer[name];
        const foundAllergy = allergies.find(element => {
            return userIngredients.find(item => {
                if (item === element) {
                    return true
                }
            });
        });
        return foundAllergy ? [foundAllergy] : [];
    };

    getSum = (ingredients) => {
        const sumArray = [];
        ingredients.forEach(i => sumArray.push(price[i]));
        return Math.round(sumArray.reduce((total, amount) => total + amount) * 1.3);
    };

    getTotalBudget = (sum, totalBudget) => {
        return totalBudget - sum
    };

    sendResult = (foundAllergies, name, order, sum) => {
        if (foundAllergies) {
            warehousesHandler.reduceQuantities(order);
            return `${name} can’t order ${order}, allergic to: ${foundAllergies}`
        } else
        if (this.clientBudget[name] < sum) {
            return `${name} – can’t order, budget ${this.clientBudget[name]} and ${order} costs ${sum}`
        }
        else {
            this.clientBudget[name] = this.getTotalBudget(sum, this.clientBudget[name]);
            restaurantBudgetService.increaseRestaurantBudget(sum);
            warehousesHandler.reduceQuantities(order);
            return `${name} - ${order} costs ${sum}: success`;
        }
    };

    buy = (person, order) => {
        const userIngredients = [];
        this.checkAllIngredients(order, userIngredients);

        const foundAllergy =  this.getAllergies(person, userIngredients)[0] || '';

        let sum = this.getSum(userIngredients);
        if (!this.clientBudget[person] && this.clientBudget[person] !== 0) {
            this.clientBudget[person] = budget[person];
        }
        const sendRes = this.sendResult(foundAllergy, person, order, sum);
        fileReader.appendFile(sendRes);
        return { sendRes, sum };
    }

    buyForTable = (person, order) => {
        const userIngredients = [];
        this.checkAllIngredients(order, userIngredients);

        const foundAllergy =  this.getAllergies(person, userIngredients)[0] || '';

        let sum = this.getSum(userIngredients);
        if (!this.clientBudget[person] && this.clientBudget[person] !== 0) {
            this.clientBudget[person] = budget[person];
        }
        if (foundAllergy) {
            return { code: messageCodes.allergy, message: `FAILURE. ${person} can’t order ${order}, allergic to: ${foundAllergy}. So, whole table fails.` };
        } else if (this.clientBudget[person] < sum) {
            return { code: messageCodes.budget, message: `FAILURE. ${person} – can’t order, budget ${this.clientBudget[person]} and ${order} costs ${sum}. So, whole table fails.` };
        } else {
            return { code: messageCodes.success, sum, message: `${person} - ${order} costs ${sum}: success`};
        }
    }

    table = (person1, order1, person2, order2) => {
        const res1 = this.buyForTable(person1, order1);
        const res2 = this.buyForTable(person2, order2);
        if (res1.code === messageCodes.success && res2.code === messageCodes.success ) {
            this.clientBudget[person1] = this.getTotalBudget(res1.sum, this.clientBudget[person1]);
            restaurantBudgetService.increaseRestaurantBudget(res1.sum);
            warehousesHandler.reduceQuantities(order1);
            this.clientBudget[person2] = this.getTotalBudget(res2.sum, this.clientBudget[person2]);
            restaurantBudgetService.increaseRestaurantBudget(res2.sum);
            warehousesHandler.reduceQuantities(order2);
            const message = `Success: money amount ${res1.sum + res2.sum}
            {
             ${res1.message}
             ${res2.message}
            }`;
            fileReader.appendFile(message);
            return message;
        } else if (res1.code !== messageCodes.success) {
            fileReader.appendFile(res1.message);
            return res1.message;
        } else if (res2.code !== messageCodes.success) {
            fileReader.appendFile(res2.message);
            return res2.message;
        }
    }

    getClientBudget = (name) => {
        return this.clientBudget[name];
    };
}

const orderHandler = new OrderHandler();

module.exports = orderHandler;