const jsonData = require('../resources/input_files/data.json');
const priceData = require('../resources/input_files/price.json');
const budgetData = require('../resources/input_files/budget.json');
const { FileReader } = require('./fileReader');

const fileReader = new FileReader;

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];
const price = priceData['Base ingredients'];
const budget = budgetData['Regular customer budget'];

class OrderHandler {
    constructor() {
        this.clientBudget = {};
        this.restaurantBudget = 500;
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
            return `${name} can’t order ${order}, allergic to: ${foundAllergies}`
        } else
        if (this.clientBudget[name] < sum) {
            return `${name} – can’t order, budget ${this.clientBudget[name]} and ${order} costs ${sum}`
        }
        else {
            this.clientBudget[name] = this.getTotalBudget(sum, this.clientBudget[name]);
            this.increaseRestaurantBudget(sum);
            return `${name} - ${order} costs ${sum}: success`;
        }
    };

    buy = (name, order) => {
        const userIngredients = [];
        this.checkAllIngredients(order, userIngredients);

        const foundAllergy =  this.getAllergies(name, userIngredients)[0] || '';

        let sum = this.getSum(userIngredients);
        if (!this.clientBudget[name] && this.clientBudget[name] !== 0) {
            this.clientBudget[name] = budget[name];
        }

        return { foundAllergy, sum }
    }

    increaseRestaurantBudget = (sum) => {
        this.restaurantBudget += sum
    }

    decreaseRestaurantBudget = (ingredient, amount) => {
        const orderAmount = this.order(ingredient, amount);
        this.restaurantBudget -= orderAmount;
    }

    order = (ingredient, amount) => {
        return price[ingredient] * amount
    }

    modifyRestaurantBudget = (sign, amount) => {
        if (sign === '=') {
            this.restaurantBudget = amount;
        }
        if (sign === '+') {
            this.restaurantBudget += amount;
        }
        if (sign === '-') {
            this.restaurantBudget -= amount;
        }
        // return `Restaurant budget: ${this.restaurantBudget}`;
    }

    result = async (name, order) => {
        const { foundAllergy, sum } = this.buy(name, order);
        const sendRes = this.sendResult(foundAllergy, name, order, sum);
        await fileReader.appendFile(sendRes);
        console.log(sendRes);

        const clientBudget = this.getClientBudget(name);
        const restaurantBudget = this.getRestaurantBudget();

        return { clientBudget, restaurantBudget }
    };

    getClientBudget = (name) => {
        return this.clientBudget[name];
    };

    getRestaurantBudget = () => {
        return this.restaurantBudget;
    }
}

module.exports = {
    OrderHandler
};