const buyService = require('../servises/buyService');
const restaurantBudget = require("../servises/restaurantBudget");
const messageCodes = require("../resources/messageCodes.json");
const warehousesService = require("../servises/warehousesHandler");
const orderService = require('../servises/orderService');
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

describe('getSum function', () => {
    test('should return sum + 30% (default)', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const res = buyService.getSum(userIngredients);
        expect(res).equal(13);
    });
    test('should return sum + 40%', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const margin = 40;
        const res = buyService.getSum(userIngredients, margin);
        expect(res).equal(14);
    });
    test('should be defined', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const sumArr = [];
        expect(buyService.getSum(userIngredients, sumArr)).not.to.be.undefined;
    });
});

describe('Margin', () => {
    test('profitMargin fn:  profit margin exists and equal 40 - should return 1,4', () => {
        const margin = 40;
        const res = buyService.profitMargin(margin);
        expect(res).equal(1.4);
    });
    test('profitMargin fn: margin not exists (margin = undefined) should return 1,3 (default)', () => {
        const margin = undefined;
        const res = buyService.profitMargin(margin);
        expect(res).equal(1.3);
    });
    test('profitMargin fn: margin = 0 - should return 1,3 (default) ', () => {
        const margin = 0;
        const res = buyService.profitMargin(margin);
        expect(res).equal(1.3);
    });
    test('getMargin fn: margin = 0 => should return 30', () => {
        const margin = 0
        const res = buyService.getMargin(margin)
        expect(res).equal(30);
    });
    test('getMargin fn:  margin = 40 => should return 40', () => {
        const margin = 40
        const res = buyService.getMargin(margin)
        expect(res).equal(40);
    })
})

describe('getAllergies function', () => {
    test('should contain an empty array', () => {
        const name = 'Julie Mirage';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const foundAllergies = buyService.getAllergies(name, userIngredients);
        expect(foundAllergies).length(0);
    });
    test('should return the allergy', () => {
        const name = 'Elon Carousel';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        expect(buyService.getAllergies(name, userIngredients)[0]).equal("Vinegar");
    });
});

describe('getTotalBudget function', () => {
    test('should reduce the budget (20-3)', () => {
        const name = 'Elon Carousel';
        const discountValue = 10;
        const sum = 3;
        const totalBudget = 20;
        const res = buyService.getTotalBudget(name, sum, totalBudget, discountValue);
        expect(res).equal(17);
    });
    test('should be a number', () => {
        const name = 'Elon Carousel';
        const discountValue = 10;
        const sum = 3;
        const totalBudget = 20;
        const res = buyService.getTotalBudget(name, sum, totalBudget, discountValue);
        expect(res).not.to.equal(NaN);
    });
});

describe('sendResult function', () => {
    test('should return success message', () => {
        const foundAllergies = '';
        const name = 'Julie Mirage';
        const order = 'Ruby Salad';
        const sum = 34;
        const res = buyService.sendResult(foundAllergies, name, order, sum);
        expect(res).equal(`${name} - ${order} costs ${sum}: success, tax = 4`);
    });
    test('should block the order due to allergies => can’t order message', () => {
        const foundAllergies = 'Vinegar';
        const name = 'Elon Carousel';
        const order = 'Ruby Salad';
        const sum = 12;
        const configuration = {"dishes with allergies": 20}
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const totalMax = 100;
        const localMax = 10;
        const res = buyService.sendResult(foundAllergies, name, order, sum, configuration, totalMax, localMax, userIngredients);
        expect(res).equal(`${name} can’t order ${order}, allergic to: ${foundAllergies}`);
    });
    // test('should block the order due to budget', () => {
    //     const foundAllergies = null;
    //     const name = 'Elon Carousel';
    //     const order = 'Emperor Chicken';
    //     const sum = 284;
    //     const res = buyService.sendResult(foundAllergies, name, order, sum);
    //     expect(res).equal(`Elon Carousel – can’t order, budget 50 and Emperor Chicken costs 284`);
    // });
});

describe('order action', () => {
    test('should multiply the price of the ingredient by the quantity => 25*10', () => {
        const ingredient = 'Tuna';
        const number = 10;
        const res = restaurantBudget.order(ingredient, number);
        expect(res).equal(250);
    });
});

describe('table action', () => {
    test('should return success message, total sum, total tax', () => {
        const persons = ['Barbara Smith', 'Adam Smith'];
        const orders = ['Smashed Potatoes', 'Fries'];
        const margin = 40;
        const res = buyService.table(persons, orders, margin);
        expect(res.message).equal(messageCodes.success);
        expect(res.totalSum).equal(10);
        expect(res.totalTax).equal(2);
    });
    test('should return FAILURE(foundAllergy)', () => {
        const persons = ['Barbara Smith', 'Adam Smith'];
        const orders = ['Tuna Cake', 'Fries'];
        const margin = 40;
        const res = buyService.table(persons, orders, margin);
        expect(res.message).equal(`FAILURE. Barbara Smith can’t order Tuna Cake, allergic to: Chocolate. So, whole table fails.`);
    });
    test('should return FAILURE(lack of budget)', () => {
        const persons = ['Julie Mirage', 'Adam Smith'];
        const orders = ['Princess Chicken', 'Fries'];
        const margin = 40;
        const res = buyService.table(persons, orders, margin);
        expect(res.message).equal(`FAILURE. Julie Mirage – can’t order, budget 100 and Princess Chicken costs 126. So, whole table fails.`);
    });
});

describe('dishesWithAllergies', () => {
    beforeEach(() => {
        chai.spy.on(warehousesService, 'reduceQuantities', () => {});
        chai.spy.on(orderService, 'sumForKeepedOrder', () => ({ orderSum: 500 }));
    });

    afterEach(() => {
        chai.spy.restore();
    });
    test('waste case', () => {
        const configuration = 'waste';
        const order = 'Tuna';
        const warehouses = {'Lemon': 10, 'Tuna': 5, 'Milk': 10, 'Tuna Cake': 3};
        const totalMax = 20;
        const localMax = 10;
        const ingredients = ['Tuna'];
        const transactionTax = 10;
        const trash = {};
        buyService.dishesWithAllergies(configuration, order, warehouses, totalMax, localMax, ingredients, transactionTax, trash);
        expect(warehousesService.reduceQuantities).to.have.been.called();
    });
    test('keep case', () => {
        chai.spy.on(buyService, 'keep', () => {});
        const configuration = 'keep';
        const order = 'Tuna';
        const warehouses = {'Lemon': 10, 'Tuna': 5, 'Milk': 10, 'Tuna Cake': 3};
        const totalMax = 20;
        const localMax = 10;
        const ingredients = ['Tuna'];
        const transactionTax = 10;
        buyService.dishesWithAllergies(configuration, order, warehouses, totalMax, localMax, ingredients, transactionTax);
        expect(buyService.keep).to.have.been.called();
    });
    test('number case exceeds the cost', () => {
        chai.spy.on(buyService, 'keep', () => {});
        const configuration = 1;
        const order = 'Tuna';
        const warehouses = {'Lemon': 10, 'Tuna': 5, 'Milk': 10, 'Tuna Cake': 3};
        const totalMax = 20;
        const localMax = 10;
        const ingredients = ['Tuna'];
        const transactionTax = 10;
        buyService.dishesWithAllergies(configuration, order, warehouses, totalMax, localMax, ingredients, transactionTax);
        expect(buyService.keep).to.have.been.called();
    });
    test('number case not exceeds the cost', () => {
        const configuration = 1000;
        const order = 'Tuna';
        const warehouses = {'Lemon': 10, 'Tuna': 5, 'Milk': 10, 'Tuna Cake': 3};
        const totalMax = 20;
        const localMax = 10;
        const ingredients = ['Tuna'];
        const transactionTax = 10;
        buyService.dishesWithAllergies(configuration, order, warehouses, totalMax, localMax, ingredients, transactionTax);
        expect(warehousesService.reduceQuantities).to.have.been.called();
    });
})