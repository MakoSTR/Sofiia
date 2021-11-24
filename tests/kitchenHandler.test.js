const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const kitchenHandler = require("../handlers/kitchenHandler");
const warehouseService = require("../servises/warehousesHandler");
const restaurantBudget = require('../servises/restaurantBudget');
const {expect} = require("chai");
const fileReader = require('../servises/fileReader');

describe('kitchenHandler', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('sendRestaurantBudget function: valid Restaurant Budget => should return 500', () => {
        chai.spy.on(restaurantBudget, 'getRestaurantBudget', () => 500);
        chai.spy.on(fileReader, 'appendFile', () => {});
        const res = kitchenHandler.sendRestaurantBudget();
        expect(res).to.equal(500)
    });
    test('sendRestaurantBudget function: negative Restaurant Budget => should return RESTAURANT BANKRUPT', () => {
        chai.spy.on(restaurantBudget, 'getRestaurantBudget', () => -100);
        chai.spy.on(fileReader, 'appendFile', () => {});
        const res = kitchenHandler.sendRestaurantBudget();
        expect(res).to.equal('RESTAURANT BANKRUPT')
    });

    test('order: => decreaseRestaurantBudget have to be called',  () => {
         chai.spy.on(warehouseService, "getWarehouses", () => ({ "Tuna": 2 }));
         chai.spy.on(restaurantBudget, 'decreaseRestaurantBudget', () => 'Test');
        const res = kitchenHandler.order("Tuna", 1, 10);
        expect(restaurantBudget.decreaseRestaurantBudget).to.have.been.called();
        expect(restaurantBudget.decreaseRestaurantBudget).to.have.been.called.with('Tuna', 1, 10);
    });

    test('findLocalMax => should return max ingredient type when order ingredient ', () => {
        const order = 'Tuna';
        const command = {
            "max ingredient type": 10,
            "max dish type": 3
        };
        const res = kitchenHandler.findLocalMax(order, command);
        expect(res).equal(10);
    });
    test('findLocalMax => should return max dish type when order dish ', () => {
        const order = 'Fries';
        const command = {
            "max ingredient type": 10,
            "max dish type": 3
        };
        const res = kitchenHandler.findLocalMax(order, command);
        expect(res).equal(3);
    });
    test('isMalformedFood => should return true when order dish is malformed (not exist)', () => {
        const order = 'Princess Chicken';
        const dishes = ["Fries", "Emperor Chicken", 'Princess Chicken'];
        const res = kitchenHandler.isMalformedFood(order, dishes);
        expect(res).equal(false);
    });
    test('isMalformedFood => should return false when order dish is exists', () => {
        const order = 'Pizza';
        const dishes = ["Fries", "Emperor Chicken", 'Princess Chicken'];
        const res = kitchenHandler.isMalformedFood(order, dishes);
        expect(res).equal(true);
    });
});