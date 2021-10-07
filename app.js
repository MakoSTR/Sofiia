const jsonData = require('./data.json');

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const base = jsonData['Base ingredients'];

// recursion - checkAllIngredients

let userIngredients = [];

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

const sendResult = (foundAllergies, name, order) => {
    //main logic
    if (foundAllergies) {
        console.log(`${name} can’t order ${order}, allergic to: ${foundAllergies}`)
    }
    else console.log(`${name} - ${order}: success`)
};

const fn = (name, order) => {
    checkAllIngredients(order)
    const allergies = regularCustomer[name];
    const foundAllergies = allergies.find(element => {
        return userIngredients.find(item => {
            if (item === element) {
                return true
            }
        });
    });
    sendResult(foundAllergies, name, order);
};

// fn('Julie Mirage', 'Fries');
// fn('Barbara Smith', 'Tuna Cake');
// fn('Bernard Unfortunate', 'Smashed Potatoes');
fn('Julie Mirage', 'Fish In Water');
// fn('Elon Carousel', 'Emperor Chicken');





