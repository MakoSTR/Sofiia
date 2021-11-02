const jsonData = require('../resources/input_files/data.json');
const priceData = require('../resources/input_files/price.json');
const budgetData = require('../resources/input_files/budget.json');
const messageCodes = require('../resources/messageCodes.json');
const warehouses = require("../resources/input_files/warehouses.json");
const FileReader = require('./fileReader');
const restaurantBudgetService = require('./restaurantBudget');
const warehousesService = require('./warehousesHandler');

const fileReader = new FileReader();
const filePathForOutput = './resources/output_files/output.txt';

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
            warehousesService.reduceQuantities(order, warehouses);
            return `${name} can’t order ${order}, allergic to: ${foundAllergies}`
        } else
        if (this.clientBudget[name] < sum) {
            return `${name} – can’t order, budget ${this.clientBudget[name]} and ${order} costs ${sum}`
        }
        else {
            this.clientBudget[name] = this.getTotalBudget(sum, this.clientBudget[name]);
            restaurantBudgetService.increaseRestaurantBudget(sum);
            warehousesService.reduceQuantities(order, warehouses);
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
        fileReader.appendFile(filePathForOutput, sendRes);
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

    table = (customers, dishes) => {
        const resArr = [];
        customers.forEach((customer, index) => {
            const res = this.buyForTable(customer, dishes[index]);
            resArr.push(res);
        });

        const checkResSuccess = resArr.every(res => res.code === messageCodes.success);

        if (checkResSuccess) {
            const totalSum = resArr.reduce((previousValue, currentValue) => {
                return previousValue + currentValue.sum;
            }, 0);
            fileReader.appendFile(filePathForOutput, `Success: money amount ${totalSum}\n{`);
            customers.forEach((customer, index) => {
                this.clientBudget[customer] = this.getTotalBudget(resArr[index].sum, this.clientBudget[customer]);
                restaurantBudgetService.increaseRestaurantBudget(resArr[index].sum);
                warehousesService.reduceQuantities(dishes[index], warehouses);
                fileReader.appendFile(filePathForOutput, `    ${resArr[index].message}`);
            });
            fileReader.appendFile(filePathForOutput, `}`);
            return messageCodes.success
        } else {
            const errorMessage = resArr.find(res => {
                return res.code !== messageCodes.success;
            }).message;
            fileReader.appendFile(filePathForOutput, errorMessage);

            return errorMessage;
        }
    }

    getClientBudget = (name) => {
        return this.clientBudget[name];
    };
}

const orderHandler = new OrderHandler();

module.exports = orderHandler;