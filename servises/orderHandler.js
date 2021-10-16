const jsonData = require('../resources/input_files/data.json');
const priceData = require('../resources/input_files/price.json');
const budgetData = require('../resources/input_files/budget.json');
const { FileWriter } = require('./fileWriter');

const fileWriter = new FileWriter;

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];
const price = priceData['Base ingredients'];
const budget = budgetData['Regular customer budget'];

class OrderHandler {
    constructor() {
        this.clientBudget;
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
        return sumArray.reduce((total, amount) => total + amount);
    };

    getTotalBudget = (sum, totalBudget) => {
        return totalBudget - sum
    };

    sendResult = (foundAllergies, name, order, userIngredients) => {
        let sum = this.getSum(userIngredients);
        if (!this.clientBudget && this.clientBudget !== 0) {
            this.clientBudget = budget[name];
        }
        if (foundAllergies) {
            return `${name} can’t order ${order}, allergic to: ${foundAllergies}`
        } else
        if (this.clientBudget < sum) {
            return `${name} – can’t order, budget ${this.clientBudget} and ${order} costs ${sum}`
        }
        else {
            this.clientBudget = this.getTotalBudget(sum, this.clientBudget);
            return `${name} - ${order}: success`;
        }
    };

    result = (name, order) => {
        const userIngredients = [];

        this.checkAllIngredients(order, userIngredients)

        const foundAllergy = this.getAllergies(name, userIngredients)[0] || '';

        const sendRes = this.sendResult(foundAllergy, name, order, userIngredients);
        fileWriter.writeFile(sendRes)
        console.log(sendRes);

        return this.getBudget();
    };

    getBudget = () => {
        return this.clientBudget;
    };

// result('Julie Mirage', 'Fries'); //Julie Mirage, Fries    //Julie Mirage, Youth Sauce    //Julie Mirage, Ruby Salad
// result('Bernard Unfortunate', 'Smashed Potatoes'); // Bernard Unfortunate, Smashed Potatoes
// result('Barbara Smith', 'Tuna Cake'); // Barbara Smith, Tuna Cake
// result('Julie Mirage', 'Fish In Water'); // Julie Mirage, Fish In Water
// result('Elon Carousel', 'Emperor Chicken'); Elon Carousel, Emperor Chicken   ///$
// result('Elon Carousel', 'Fish In Water'); Elon Carousel, Fish In Water

// console.log('outside', sum());
}

module.exports = {
    OrderHandler
};