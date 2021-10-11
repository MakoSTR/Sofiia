const jsonData = require('../recources/input_files/data.json');
const priceData = require('../recources/input_files/price.json');
const budgetData = require('../recources/input_files/budget.json');

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];
const price = priceData['Base ingredients'];
const budget = budgetData['Regular customer budget'];

let userIngredients = [];

// checkAllIngredients (recursion)
const checkAllIngredients = (order, userIngredients) => {
    const ingredients = food[order];

    for ( let i = 0; i < ingredients.length; i++ ) {
        if (base.find(item => ingredients[i] === item )) {
            userIngredients.push(ingredients[i])
        } else {
            checkAllIngredients(ingredients[i], userIngredients)
        }
    };
};

const getAllergies = (name, userIngredients) => {
    const allergies = regularCustomer[name];
    return  allergies.find(element => {
        return userIngredients.find(item => {
            if (item === element) {
                return true
            };
        });
    });
};

let sumArr = [];

const getSum = (ingredients, sumArray) => {
    ingredients.forEach(i => sumArray.push(price[i]));
    return sumArray.reduce((total, amount) => total + amount);
};

const sendResult = (foundAllergies, name, order) => {
    let sum = getSum(userIngredients, sumArr);
    if (foundAllergies) {
        console.log(`${name} can’t order ${order}, allergic to: ${foundAllergies}`)
    } else
    if (sum > budget[name] ) {
        console.log(`${name} – can’t order, budget ${budget[name]} and ${order} costs ${sum}`)
    }
    else console.log(`${name} - ${order}: success`)
};

const result = (name, order) => {
    checkAllIngredients(order, userIngredients)

    const foundAllergies = getAllergies(name, userIngredients);

    sendResult(foundAllergies, name, order);
};

// result('Julie Mirage', 'Fries'); //Julie Mirage, Fries
// result('Barbara Smith', 'Tuna Cake'); // Barbara Smith, Tuna Cake
// result('Bernard Unfortunate', 'Smashed Potatoes'); // Bernard Unfortunate, Smashed Potatoes
// result('Julie Mirage', 'Fish In Water'); // Julie Mirage, Fish In Water
// result('Elon Carousel', 'Emperor Chicken'); Elon Carousel, Emperor Chicken
// result('Elon Carousel', 'Fish In Water'); Elon Carousel, Fish In Water

// console.log('outside', sum());

module.exports = {
    result,
    getSum,
    checkAllIngredients,
    getAllergies
}