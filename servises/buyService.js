const jsonData = require('../resources/input_files/data.json');
const priceData = require('../resources/input_files/price.json');
const budgetData = require('../resources/input_files/budget.json');
const messageCodes = require('../resources/messageCodes.json');
const commandConfiguration = require('../resources/input_files/commandConfiguration.json');
const fileReader = require('./fileReader');
const restaurantBudgetService = require('./restaurantBudget');
const warehousesService = require('./warehousesHandler');
const taxService = require('./taxService');
const discountService = require('./discountService');
const orderService = require("./orderService");
const {checkAllIngredients} = require("../helpers/helpers");
const trashService = require("../servises/trashService");
const audit = require("../servises/audit")

const filePathForOutput = './resources/output_files/output.txt';
const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];
const price = priceData['Base ingredients'];
const budget = budgetData['Regular customer budget'];


class BuyService {
    constructor() {
        this.clientBudget = {};
        this.price = 0
        this.name = ""
    }

    getAllergies = (name, userIngredients) => {
        const allergies = regularCustomer[name];
        const foundAllergy = allergies.find(element => {
            return userIngredients.find(item => {
                if (item === element) {
                    return true
                }
            });
        });
        return foundAllergy ? [foundAllergy] : []; //ф-я поверне алергію, якщо знайде, якщо ні - порожній масив
    };

    profitMargin = margin => {
        const getMargin = this.getMargin(margin)
        return 1 + getMargin / 100
    }

    getMargin = margin => {
        return margin ? margin : 30
    }

    getSum = (ingredients, margin) => {
        const sumArray = [];
        const profitMargin = this.profitMargin(margin)
        ingredients.forEach(i => sumArray.push(price[i]));
        this.price = Math.ceil(sumArray.reduce((total, amount) => total + amount) * profitMargin)
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

        this.name = name

        return totalBudget - sum + discount;
    };


    //функція перевіряє на алегрію, брак грошей в клієнта, або саксес
    sendResult = (foundAllergies, name, order, sum, configuration, totalMax, localMax, ingredients, trash) => {
        const warehouses = warehousesService.getWarehouses();
        if (foundAllergies) {
            this.dishesWithAllergies(configuration, order, warehouses, totalMax, localMax, ingredients, commandConfiguration["transaction tax"], trash);
            return `${name} can’t order ${order}, allergic to: ${foundAllergies}`
        } else if (this.clientBudget[name] < sum) {
            return `${name} – can’t order, budget ${this.clientBudget[name]} and ${order} costs ${sum}`
        } else {
            discountService.addPerson(name);
            this.clientBudget[name] = this.getTotalBudget(name, sum, this.clientBudget[name], commandConfiguration["every third discount"]);
            restaurantBudgetService.increaseRestaurantBudget(name, sum, commandConfiguration["transaction tax"], commandConfiguration["every third discount"]);
            taxService.addAlreadyCollectedTax(sum, commandConfiguration["transaction tax"]);
            warehousesService.reduceQuantities(order, warehouses);
            const sumOfDiscount = discountService.makeDiscount(name, sum, commandConfiguration["every third discount"]);
            const tax = taxService.transactionTaxSum(sum, commandConfiguration["transaction tax"]);
            const discount = sumOfDiscount > 0 ? `, discount = ${sumOfDiscount}` : '';
            return `${name} - ${order} costs ${sum}: success, tax = ${tax}${discount}`;
        }
    };

    buy = (person, order, margin, configuration, totalMax, localMax, trash) => {
        const userIngredients = [];
        checkAllIngredients(order, userIngredients, food, base);

        const foundAllergy = this.getAllergies(person, userIngredients)[0] || '';

        let sum = this.getSum(userIngredients, margin);
        if (!this.clientBudget[person] && this.clientBudget[person] !== 0) {
            this.clientBudget[person] = budget[person];
        }
        const sendRes = this.sendResult(foundAllergy, person, order, sum, configuration, totalMax, localMax, userIngredients, trash);
        fileReader.appendFile(filePathForOutput, sendRes);
        return {sendRes, sum};
    }

    buyForTable = (person, order, margin) => {
        const userIngredients = [];
        checkAllIngredients(order, userIngredients, food, base);

        const foundAllergy = this.getAllergies(person, userIngredients)[0] || '';

        let sum = this.getSum(userIngredients, margin);
        if (!this.clientBudget[person] && this.clientBudget[person] !== 0) {
            this.clientBudget[person] = budget[person];
        }
        if (foundAllergy) {
            return {
                code: messageCodes.allergy,
                message: `FAILURE. ${person} can’t order ${order}, allergic to: ${foundAllergy}. So, whole table fails.`
            };
        } else if (this.clientBudget[person] < sum) {
            return {
                code: messageCodes.budget,
                message: `FAILURE. ${person} – can’t order, budget ${this.clientBudget[person]} and ${order} costs ${sum}. So, whole table fails.`
            };
        } else {
            const tax = taxService.transactionTaxSum(sum, commandConfiguration["transaction tax"]);
            return {
                code: messageCodes.success,
                sum,
                tax,
                message: `${person} - ${order} costs ${sum}: success, tax = ${tax}`
            };
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
                const warehouses = warehousesService.getWarehouses();
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
            return {message: messageCodes.success, totalTax, totalSum}
        } else {
            const errorMessage = resArr.find(res => {
                return res.code !== messageCodes.success;
            }).message;
            fileReader.appendFile(filePathForOutput, errorMessage);

            return {message: errorMessage};
        }
    }

    keep = (order, warehouses, totalMax, localMax, ingredients, transactionTax, sum) => {
        const totalSum = warehousesService.getTotalSumFromWarehouse(warehouses);
        const localSum = warehousesService.getAmountFromWarehouse(warehouses, order)
        if (1 + totalSum <= totalMax && 1 + localSum <= localMax) {
            restaurantBudgetService.restaurantBudget -= sum.orderSum + sum.extraSum;
            if (warehousesService.checkIsDish(order).length > 0 && warehouses[order] === 0) {
                warehousesService.reduceQuantities(order, warehouses);
                warehousesService.addIngredients(warehouses, order, 1);
            }
        }
        console.log('keep');
    }

    dishesWithAllergies = (configuration, order, warehouses, totalMax, localMax, ingredients, transactionTax, trash) => {
        const sum = orderService.sumForKeepedOrder(ingredients, 0, transactionTax);

        switch (configuration) {
            case 'waste':
                warehousesService.reduceQuantities(order, warehouses);
                ingredients.forEach(everyIngredient => {
                    trashService.trashService(commandConfiguration["waste limit"], trash, 1, everyIngredient)
                });
                break;
            case 'keep':
                this.keep(order, warehouses, totalMax, localMax, ingredients, transactionTax, sum);
                break;
            default:
                if (sum.orderSum <= configuration) {
                    warehousesService.reduceQuantities(order, warehouses);
                    ingredients.forEach(everyIngredient => {
                        trashService.trashService(commandConfiguration["waste limit"], trash, 1, everyIngredient)
                    });
                } else {
                    console.log(configuration)
                    this.keep(order, warehouses, totalMax, localMax, ingredients, transactionTax, sum);
                }
        }
    }

    getTips = (value) => {

        // if
        var result1 = commandConfiguration["max tip"]
        var result2 = this.getRandomInt(1, 3)
        if (result2 === 2) {
            var result3 = this.getRandomInt(1, result1)
            var result5 = this.price / 100 * result3
            // console.log(result3 + " %")
            // console.log(parseFloat(result5.toFixed(1)))
            if ((this.clientBudget[this.name] - result5) < 0){
                return this.clientBudget[this.name]
            }else{
                return parseFloat(result5.toFixed(1))
            }
        } else {
            return 0
        }
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

const buyService = new BuyService();

module.exports = buyService;