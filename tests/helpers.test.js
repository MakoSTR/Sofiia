const { createAuditMessage, disabler, checkAllIngredients } = require('../helpers/helpers');
const jsonData = require("../resources/input_files/data.json");

describe('Helpers', () => {
    test('createAuditMessage function with length = 3 => should return array with arrow(=>) and message ', () => {
        const inputArr = ["Buy", "Alexandra Smith", "Fries"];
        const resMessage = 'res for test'
        const res = createAuditMessage(inputArr, resMessage)
        expect(res).toBe('Buy,Alexandra Smith,Fries => res for test')
    });
    test('createAuditMessage function with length = 2 =>  should return array with arrow(=>) and message ', () => {
        const inputArr = ["Buy", "Alexandra Smith"];
        const resMessage = 'res for test'
        const res = createAuditMessage(inputArr, resMessage)
        expect(res).toBe('Buy,Alexandra Smith => res for test')
    });
    test('disabler function should return message for Buy', () => {
        const i = ['Buy', 'Alexandra Smith', 'Fries'];
        const res = disabler(i)
        expect(res).toBe('Buy command disabled')
    });
    test('disabler function should return message message for Audit', () => {
        const i = ['Audit', 'Resources'];
        const res = disabler(i)
        expect(res).toBe('Audit command disabled')
    });
});

describe('checkAllIngredients function', () => {
    test('userIngredients should contain all ingredients when food contains all base ingredients', () => {
        const food = {"Ruby Salad": ["Tomatoes", "Vinegar", "Chocolate"], "Fries": ["Potatoes"]};
        const base = ["Paprika", "Tomatoes", "Pickles", "Feta", "Vinegar", "Chocolate"];
        const userIngredients = [];
        checkAllIngredients('Ruby Salad', userIngredients, food, base);
        expect(userIngredients[0]).toEqual("Tomatoes");
        expect(userIngredients[1]).toEqual("Vinegar");
        expect(userIngredients[2]).toEqual("Chocolate");
        expect(userIngredients.length).toBe(3);
    });
    test('userIngredients should contain all ingredients when food contains only one base ingredient', () => {
        const food = {"Ruby Salad": ["Tomatoes", "Vinegar", "Chocolate"], "Fries": ["Potatoes"]};
        const base = ["Paprika", "Tomatoes", "Pickles", "Feta", "Vinegar", "Chocolate", "Potatoes"];
        const userIngredients = [];
        checkAllIngredients('Fries', userIngredients, food, base);
        expect(userIngredients[0]).toEqual("Potatoes");
        expect(userIngredients.length).toBe(1);
    });
    test('userIngredients should contain all ingredients when food contains only dishes', () => {
        const food = {
            "Fat Cat Chicken": ["Princess Chicken", "Youth Sauce", "Fries", "Diamond Salad"],
            "Princess Chicken": ["Chicken", "Youth Sauce"],
            "Youth Sauce": ["Asparagus", "Milk", "Honey"],
            "Spicy Sauce": ["Paprika", "Garlic", "Water"],
            "Omega Sauce": ["Lemon", "Water"],
            "Diamond Salad": ["Tomatoes", "Pickles", "Feta"],
            "Ruby Salad": ["Tomatoes", "Vinegar", "Chocolate"],
            "Fries": ["Potatoes"],
            "Smashed Potatoes": ["Potatoes"],
            "Tuna Cake": ["Tuna", "Chocolate", "Youth Sauce"],
            "Fish In Water": ["Tuna", "Omega Sauce", "Ruby Salad"],
            "Irish Fish": ["Tuna", "Fries", "Smashed Potatoes"]
        };
        const base = ["Chicken", "Tuna", "Potatoes", "Asparagus", "Milk",
            "Honey", "Paprika", "Garlic", "Water", "Lemon", "Tomatoes",
            "Pickles", "Feta", "Vinegar", "Rice", "Chocolate"];
        const userIngredients = [];
        checkAllIngredients('Fat Cat Chicken', userIngredients, food, base);
        expect(userIngredients.length).toBe(11);
    });
    test('userIngredients should contain all ingredients when food contains dishes and base ingredient ', () => {
        const food = {
            "Fat Cat Chicken": ["Princess Chicken", "Youth Sauce", "Fries", "Diamond Salad"],
            "Princess Chicken": ["Chicken", "Youth Sauce"],
            "Youth Sauce": ["Asparagus", "Milk", "Honey"],
            "Spicy Sauce": ["Paprika", "Garlic", "Water"],
            "Omega Sauce": ["Lemon", "Water"],
            "Diamond Salad": ["Tomatoes", "Pickles", "Feta"],
            "Ruby Salad": ["Tomatoes", "Vinegar", "Chocolate"],
            "Fries": ["Potatoes"],
            "Smashed Potatoes": ["Potatoes"],
            "Tuna Cake": ["Tuna", "Chocolate", "Youth Sauce"],
            "Fish In Water": ["Tuna", "Omega Sauce", "Ruby Salad"],
            "Irish Fish": ["Tuna", "Fries", "Smashed Potatoes"]
        };
        const base = ["Chicken", "Tuna", "Potatoes", "Asparagus", "Milk",
            "Honey", "Paprika", "Garlic", "Water", "Lemon", "Tomatoes",
            "Pickles", "Feta", "Vinegar", "Rice", "Chocolate"];
        const userIngredients = [];
        checkAllIngredients('Tuna Cake', userIngredients, food, base);
        expect(userIngredients.length).toBe(5);
    });
});
