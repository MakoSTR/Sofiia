// const fs = require('fs');
const jsonData = require('./data.json');

const regularCustomer = jsonData['Regular customer'];
const food = jsonData.Food;
const baseingredients = jsonData['Base ingredients'];

const fn = (name, order) => {
        const allergies = regularCustomer[name];
        const ingredients = food[order];
        allergies.forEach(element => {
            const foundAllergies = ingredients.find(item => {
                if (item === element) {
                    return true
                }
            });
            if (foundAllergies) {
                console.log(`${name} can’t order ${order}, allergic to: ${foundAllergies}`)
            }
            else console.log(`Hello ${name} - ${order}: success`)   
           
        });
}

fn('Julie Mirage', 'Fries');
fn('Barbara Smith', 'Tuna Cake');
fn('Bernard Unfortunate', 'Smashed Potatoes');
fn('Julie Mirage', 'Fish In Water');
fn('Elon Carousel', 'Fish In Water');



