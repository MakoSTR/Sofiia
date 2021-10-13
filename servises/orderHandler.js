const jsonData = require('../recources/input_files/data.json');
const priceData = require('../recources/input_files/price.json');
const budgetData = require('../recources/input_files/budget.json');

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];
const price = priceData['Base ingredients'];
const budget = budgetData['Regular customer budget'];
let clientBudget;

// checkAllIngredients (recursion)
const checkAllIngredients = (order, userIngredients) => {
    const ingredients = food[order];
    for ( let i = 0; i < ingredients.length; i++ ) {
        if (base.find(item => ingredients[i] === item )) {
            userIngredients.push(ingredients[i])
        } else {
            checkAllIngredients(ingredients[i], userIngredients)
        }
    }
};

const getAllergies = (name, userIngredients) => {
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

const getSum = (ingredients) => {
    const sumArray = [];
    ingredients.forEach(i => sumArray.push(price[i]));
    return sumArray.reduce((total, amount) => total + amount);
};

const getTotalBudget = (sum, totalBudget) => {
     return totalBudget - sum
};

const sendResult = (foundAllergies, name, order, userIngredients) => {
    let sum = getSum(userIngredients);
    if (!clientBudget && clientBudget !== 0) {
        clientBudget = budget[name];
    }
    if (foundAllergies) {
        return `${name} can’t order ${order}, allergic to: ${foundAllergies}`
    } else
    if (clientBudget < sum) {
       return `${name} – can’t order, budget ${clientBudget} and ${order} costs ${sum}`
    }
    else {
        clientBudget = getTotalBudget(sum, clientBudget);
        return `${name} - ${order}: success`;
    }
};

const result = (name, order) => {
    const userIngredients = [];

    checkAllIngredients(order, userIngredients)

    const foundAllergy = getAllergies(name, userIngredients)[0] || '';

    const sendRes = sendResult(foundAllergy, name, order, userIngredients);
    console.log(sendRes);

    return getBudget();
};

const getBudget = () => {
    return clientBudget;
};

// result('Julie Mirage', 'Fries'); //Julie Mirage, Fries    //Julie Mirage, Youth Sauce    //Julie Mirage, Ruby Salad
// result('Bernard Unfortunate', 'Smashed Potatoes'); // Bernard Unfortunate, Smashed Potatoes
// result('Barbara Smith', 'Tuna Cake'); // Barbara Smith, Tuna Cake
// result('Julie Mirage', 'Fish In Water'); // Julie Mirage, Fish In Water
// result('Elon Carousel', 'Emperor Chicken'); Elon Carousel, Emperor Chicken   ///$
// result('Elon Carousel', 'Fish In Water'); Elon Carousel, Fish In Water

// console.log('outside', sum());

module.exports = {
    result,
    getSum,
    checkAllIngredients,
    getAllergies,
    getBudget,
    getTotalBudget,
    sendResult
};