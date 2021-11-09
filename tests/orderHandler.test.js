const orderHandler = require('../servises/orderHandler');
const restaurantBudget = require("../servises/restaurantBudget");
const messageCodes = require("../resources/messageCodes.json");

describe('getSum function', () => {
    test('should return sum + 30% (default)', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const res = orderHandler.getSum(userIngredients);
        expect(res).toBe(13);
    });
    test('should return sum + 40%', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const margin = 40;
        const res = orderHandler.getSum(userIngredients, margin);
        expect(res).toBe(14);
    });
    test('should be defined', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const sumArr = [];
        expect(orderHandler.getSum(userIngredients, sumArr)).toBeDefined();
        expect(orderHandler.getSum(userIngredients, sumArr)).not.toBeUndefined();
    });
});

describe('Margin', () => {
    test('profitMargin fn:  profit margin exists and equal 40 - should return 1,4', () => {
        const margin = 40;
        const res = orderHandler.profitMargin(margin);
        expect(res).toBe(1.4);
    });
    test('profitMargin fn: margin not exists (margin = undefined) should return 1,3 (default)', () => {
        const margin = undefined;
        const res = orderHandler.profitMargin(margin);
        expect(res).toBe(1.3);
    });
    test('profitMargin fn: margin = 0 - should return 1,3 (default) ', () => {
        const margin = 0;
        const res = orderHandler.profitMargin(margin);
        expect(res).toBe(1.3);
    });
    test('getMargin fn: margin = 0 => should return 30', () => {
        const margin = 0
        const res = orderHandler.getMargin(margin)
        expect(res).toBe(30);
    });
    test('getMargin fn:  margin = 40 => should return 40', () => {
        const margin = 40
        const res = orderHandler.getMargin(margin)
        expect(res).toBe(40);
    })
})

describe('checkAllIngredients function', () => {
    test('userIngredients should contain all ingredients', () => {
        const userIngredients = [];
        orderHandler.checkAllIngredients('Ruby Salad', userIngredients);
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
    test('should reduce the budget (20-3)', () => {
        const name = 'Elon Carousel';
        const discountValue = 10;
        const sum = 3;
        const totalBudget = 20;
        const res = orderHandler.getTotalBudget(name, sum, totalBudget, discountValue);
        expect(res).toBe(17);
    });
    test('should be a number', () => {
        const name = 'Elon Carousel';
        const discountValue = 10;
        const sum = 3;
        const totalBudget = 20;
        const res = orderHandler.getTotalBudget(name, sum, totalBudget, discountValue);
        expect(res).not.toBe(NaN);
    });
});

describe('sendResult function', () => {
    test('should return success message', () => {
        const foundAllergies = '';
        const name = 'Julie Mirage';
        const order = 'Ruby Salad';
        const sum = 34;
        const res = orderHandler.sendResult(foundAllergies, name, order, sum);
        expect(res).toBe(`${name} - ${order} costs ${sum}: success, tax = 4`);
    });
    test('should block the order due to allergies => can’t order message', () => {
        const foundAllergies = 'Vinegar';
        const name = 'Elon Carousel';
        const order = 'Ruby Salad';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const res = orderHandler.sendResult(foundAllergies, name, order, userIngredients);
        expect(res).toBe(`${name} can’t order ${order}, allergic to: ${foundAllergies}`);
    });
    // test('should block the order due to budget', () => {
    //     const foundAllergies = null;
    //     const name = 'Elon Carousel';
    //     const order = 'Emperor Chicken';
    //     const sum = 284;
    //     const res = orderHandler.sendResult(foundAllergies, name, order, sum);
    //     expect(res).toBe(`Elon Carousel – can’t order, budget 50 and Emperor Chicken costs 284`);
    // });
});

describe('order action', () => {
    test('should multiply the price of the ingredient by the quantity => 25*10', () => {
        const ingredient = 'Tuna';
        const number = 10;
        const res = restaurantBudget.order(ingredient, number);
        expect(res).toBe(250);
    });
});

describe('table action', () => {
    test('should return success message, total sum, total tax', () => {
        const persons = ['Barbara Smith', 'Adam Smith'];
        const orders = ['Smashed Potatoes', 'Fries'];
        const margin = 40;
        const res = orderHandler.table(persons, orders, margin);
        expect(res.message).toBe(messageCodes.success);
        expect(res.totalSum).toBe(10);
        expect(res.totalTax).toBe(2);
    });
    test('should return FAILURE(foundAllergy)', () => {
        const persons = ['Barbara Smith', 'Adam Smith'];
        const orders = ['Tuna Cake', 'Fries'];
        const margin = 40;
        const res = orderHandler.table(persons, orders, margin);
        expect(res.message).toBe(`FAILURE. Barbara Smith can’t order Tuna Cake, allergic to: Chocolate. So, whole table fails.`);
    });
    test('should return FAILURE(lack of budget)', () => {
        const persons = ['Julie Mirage', 'Adam Smith'];
        const orders = ['Princess Chicken', 'Fries'];
        const margin = 40;
        const res = orderHandler.table(persons, orders, margin);
        expect(res.message).toBe(`FAILURE. Julie Mirage – can’t order, budget 100 and Princess Chicken costs 126. So, whole table fails.`);
    });
});