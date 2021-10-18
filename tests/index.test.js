const { OrderHandler } = require('../servises/orderHandler');

const orderHandler = new OrderHandler();

describe('getSum function', () => {
    test('should add all the ingredients in the array', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const res = orderHandler.getSum(userIngredients);
        expect(res).toBe(13);
    });
    test('should be defined', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const sumArr = [];
        expect(orderHandler.getSum(userIngredients, sumArr)).toBeDefined();
        expect(orderHandler.getSum(userIngredients, sumArr)).not.toBeUndefined();
    });
});

describe('checkAllIngredients function', () => {
    test('should contain all ingredients', () => {
        const userIngredients = [];
        const res = orderHandler.checkAllIngredients('Ruby Salad', userIngredients);
        expect(userIngredients[0]).toEqual("Tomatoes");
        expect(userIngredients[1]).toEqual("Vinegar");
        expect(userIngredients[2]).toEqual("Chocolate");
        expect(userIngredients.length).toBe(3);
    });
});

describe('getAllergies function', () => {
    test('should contain an empty array', () => {
        const name = 'Julie Mirage';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const foundAllergies = orderHandler.getAllergies(name, userIngredients);
        expect(foundAllergies).toHaveLength(0);
    });
    test('should return the allergy', () => {
        const name = 'Elon Carousel';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        expect(orderHandler.getAllergies(name, userIngredients)).toEqual(["Vinegar"]);
    });
});

describe('getTotalBudget function', () => {
    test('should reduce the budget', () => {
        const sum = 3;
        const totalBudget = 20;
        const res = orderHandler.getTotalBudget(sum, totalBudget);
        expect(res).toBe(17);
    });
    test('should be a number', () => {
        const sum = 3;
        const totalBudget = 20;
        const res = orderHandler.getTotalBudget(sum, totalBudget);
        expect(res).not.toBe(NaN);
    });
});

describe('sendResult function', () => {
    test('should return success', () => {
        const foundAllergies = '';
        const name = 'Julie Mirage';
        const order = 'Ruby Salad';
        const sum = 34;
        const res = orderHandler.sendResult(foundAllergies, name, order, sum);
        expect(res).toBe(`${name} - ${order} costs ${sum}: success`);
    });
    test('should block the order due to allergies', () => {
        const foundAllergies = 'Vinegar';
        const name = 'Elon Carousel';
        const order = 'Ruby Salad';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const res = orderHandler.sendResult(foundAllergies, name, order, userIngredients);
        expect(res).toBe(`${name} can’t order ${order}, allergic to: ${foundAllergies}`);
    });
    // test('should block the order due to budget', () => {
    //     const foundAllergies = '';
    //     const name = 'Elon Carousel';
    //     const order = 'Emperor Chicken';
    //     const sum = 284;
    //     const res = orderHandler.sendResult(foundAllergies, name, order, sum);
    //     expect(res).toBe(`Elon Carousel – can’t order, budget 50 and Emperor Chicken costs 284`);
    // });
});