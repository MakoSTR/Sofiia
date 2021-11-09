const jsonData = require('../resources/input_files/data.json');
const priceData = require('../resources/input_files/price.json');
const budgetData = require('../resources/input_files/budget.json');
const messageCodes = require('../resources/messageCodes.json');
const warehouses = require("../resources/input_files/warehouses.json");
const commandConfiguration = require('../resources/input_files/commandConfiguration.json');
const FileReader = require('./fileReader');
const restaurantBudgetService = require('./restaurantBudget');
const warehousesService = require('./warehousesHandler');
const taxService = require('./taxService');
const discountService = require('./discountService');

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

    profitMargin = margin => {
        const getMargin = this.getMargin(margin)
        return 1 + getMargin/100
    }

    getMargin = margin => {
        return margin ? margin : 30
    }

    getSum = (ingredients, margin) => {
        const sumArray = [];
        const profitMargin = this.profitMargin(margin)
        ingredients.forEach(i => sumArray.push(price[i]));
        return Math.ceil(sumArray.reduce((total, amount) => total + amount) * profitMargin);
    };

    discount = (name, sum, discount) => {
        const sumOfDiscount = discountService.makeDiscount(name, sum, discount)
        return sumOfDiscount > 0 ? sumOfDiscount : 0
    }

    getTotalBudget = (name, sum, totalBudget, discountValue) => {
        const discount = this.discount(name, sum, discountValue)
        console.log('totalBudget', name, totalBudget - sum + discount);
        console.log('discount', name, discount);

        return totalBudget - sum + discount;
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
            discountService.addPerson(name);
            this.clientBudget[name] = this.getTotalBudget(name, sum, this.clientBudget[name],  commandConfiguration["every third discount"]);
            restaurantBudgetService.increaseRestaurantBudget(name, sum, commandConfiguration["transaction tax"], commandConfiguration["every third discount"]);
            taxService.addAlreadyCollectedTax(sum, commandConfiguration["transaction tax"]);
            warehousesService.reduceQuantities(order, warehouses);
            const sumOfDiscount = discountService.makeDiscount(name, sum, commandConfiguration["every third discount"]);
            const tax = taxService.transactionTaxSum(sum, commandConfiguration["transaction tax"]);
            const discount = sumOfDiscount > 0 ? `, discount = ${sumOfDiscount}` : '';
            return `${name} - ${order} costs ${sum}: success, tax = ${tax}${discount}`;
        }
    };

    buy = (person, order, margin) => {
        const userIngredients = [];
        this.checkAllIngredients(order, userIngredients);

        const foundAllergy =  this.getAllergies(person, userIngredients)[0] || '';

        let sum = this.getSum(userIngredients, margin);
        if (!this.clientBudget[person] && this.clientBudget[person] !== 0) {
            this.clientBudget[person] = budget[person];
        }
        const sendRes = this.sendResult(foundAllergy, person, order, sum);
        fileReader.appendFile(filePathForOutput, sendRes);
        return { sendRes, sum };
    }

    buyForTable = (person, order, margin) => {
        const userIngredients = [];
        this.checkAllIngredients(order, userIngredients);

        const foundAllergy =  this.getAllergies(person, userIngredients)[0] || '';

        let sum = this.getSum(userIngredients, margin);
        if (!this.clientBudget[person] && this.clientBudget[person] !== 0) {
            this.clientBudget[person] = budget[person];
        }
        if (foundAllergy) {
            return { code: messageCodes.allergy, message: `FAILURE. ${person} can’t order ${order}, allergic to: ${foundAllergy}. So, whole table fails.` };
        } else if (this.clientBudget[person] < sum) {
            return { code: messageCodes.budget, message: `FAILURE. ${person} – can’t order, budget ${this.clientBudget[person]} and ${order} costs ${sum}. So, whole table fails.` };
        } else {
            const tax = taxService.transactionTaxSum(sum, commandConfiguration["transaction tax"]);
            return { code: messageCodes.success, sum, tax, message: `${person} - ${order} costs ${sum}: success, tax = ${tax}`};
        }
    }

    table = (customers, dishes, margin) => {
        const resArr = [];
        customers.forEach((customer, index) => {
            const res = this.buyForTable(customer, dishes[index], margin);
            resArr.push(res);
        });

        const checkResSuccess = resArr.every(res => res.code === messageCodes.success);

        if (checkResSuccess) {
            const totalSum = resArr.reduce((previousValue, currentValue) => {
                return previousValue + currentValue.sum;
            }, 0);
            const totalTax = resArr.reduce((previousValue, currentValue) => {
                return previousValue + currentValue.tax;
            }, 0)
            fileReader.appendFile(filePathForOutput, `Success: money amount ${totalSum}; tax amount ${totalTax}\n{`);
            customers.forEach((customer, index) => {
                discountService.addPerson(customer);
                const sumOfDiscount = discountService.makeDiscount(customer, resArr[index].sum, commandConfiguration["every third discount"]);
                const discount = sumOfDiscount > 0 ? `, discount = ${sumOfDiscount}` : '';
                this.clientBudget[customer] = this.getTotalBudget(customer, resArr[index].sum, this.clientBudget[customer], commandConfiguration["every third discount"]);
                restaurantBudgetService.increaseRestaurantBudget(customer, resArr[index].sum, commandConfiguration["transaction tax"], commandConfiguration["every third discount"]);
                taxService.addAlreadyCollectedTax(resArr[index].sum, commandConfiguration["transaction tax"]);
                warehousesService.reduceQuantities(dishes[index], warehouses);
                fileReader.appendFile(filePathForOutput, `    ${resArr[index].message}${discount}`);
            });
            fileReader.appendFile(filePathForOutput, `}`);
            return { message: messageCodes.success, totalTax, totalSum }
        } else {
            const errorMessage = resArr.find(res => {
                return res.code !== messageCodes.success;
            }).message;
            fileReader.appendFile(filePathForOutput, errorMessage);

            return { message: errorMessage };
        }
    }

    getClientBudget = (name) => {
        return this.clientBudget[name];
    };
}

const orderHandler = new OrderHandler();

module.exports = orderHandler;