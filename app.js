const readline = require('readline');
const jsonData = require('./recources/input_files/data.json');
const priceData = require('./recources/input_files/price.json');
const budgetData = require('./recources/input_files/budget.json');

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];
const price = priceData['Base ingredients'];
const budget = budgetData['Regular customer budget'];

let userIngredients = [];

// checkAllIngredients (recursion)
const checkAllIngredients = (order) => {
    const ingredients = food[order];

    for ( let i = 0; i < ingredients.length; i++ ) {
        if (base.find(item => ingredients[i] === item )) {
            userIngredients.push(ingredients[i])
        } else {
            checkAllIngredients(ingredients[i])
        }
    };
};

const getAllergies = (name) => {
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

const getSum = () => {
    userIngredients.forEach(i => sumArr.push(price[i]));
    return  sumArr.reduce((total, amount) => total + amount);
};

const sendResult = (foundAllergies, name, order) => {
    const sum = getSum();
    if (foundAllergies) {
        console.log(`${name} can’t order ${order}, allergic to: ${foundAllergies}`)
    } else
    if (sum > budget[name] ) {
        console.log(`${name} – can’t order, budget ${budget[name]} and ${order} costs ${sum}`)
    }
    else console.log(`${name} - ${order}: success`)
};

const result = (name, order) => {
    checkAllIngredients(order)

    const foundAllergies = getAllergies(name);

    sendResult(foundAllergies, name, order);
};


// result('Julie Mirage', 'Fries'); //Julie Mirage, Fries
// result('Barbara Smith', 'Tuna Cake'); // Barbara Smith, Tuna Cake
// result('Bernard Unfortunate', 'Smashed Potatoes'); // Bernard Unfortunate, Smashed Potatoes
// result('Julie Mirage', 'Fish In Water'); // Julie Mirage, Fish In Water
// result('Elon Carousel', 'Emperor Chicken'); Elon Carousel, Emperor Chicken
// result('Elon Carousel', 'Fish In Water'); Elon Carousel, Fish In Water

///

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Write who buys what', (answer) => {
  // TODO: Log the answer in a database
    let input = answer.split(', ');
    let person = input[0];
    let order = input[1]
    result(person, order); //person, order,

  rl.close();
});

// console.log('outside', sum());


