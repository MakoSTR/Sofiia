const restaurantBudget = require("../servises/restaurantBudget");

describe('RestaurantBudget at all', () => {
    beforeEach(() => {
        restaurantBudget.restaurantBudget = 500;
    });
    describe('modifyRestaurantBudget function', () => {
        test('should add 300 to budget', () => {
            const sign = '+';
            const amount = 300;
            const res = restaurantBudget.modifyRestaurantBudget(sign, amount);
            expect(res).toBe(800);
        });
        test('should subtract 300 to budget', () => {
            const sign = '-';
            const amount = 300;
            const res = restaurantBudget.modifyRestaurantBudget(sign, amount);
            expect(res).toBe(200);
        });
        test('should to equate budget to 300', () => {
            const sign = '=';
            const amount = 300;
            const res = restaurantBudget.modifyRestaurantBudget(sign, amount);
            expect(res).toBe(300);
        });
    });

    describe('increaseRestaurantBudget function', () => {
        test('should add 100 to budget', () => {
            const sum = 100;
            const res = restaurantBudget.increaseRestaurantBudget(sum);
            expect(res).toBe(600);
        });
    });

    describe('decreaseRestaurantBudget function', () => {
        test('decreaseRestaurantBudget ', () => {
            const ingredient = 'Tuna';
            const number = 10;
            restaurantBudget.decreaseRestaurantBudget(ingredient, number);
            expect(restaurantBudget.restaurantBudget).toBe(250);
        });
    });
    describe('order function', () => {
        test('should multiply ', () => {
            const ingredient = 'Tuna';
            const number = 10;
            const res = restaurantBudget.order(ingredient, number);
            expect(res).toBe(250);
        });
    });
    describe('addIngredients function', () => {
        test('should add quantities in the warehouses', () => {
            const warehouses = {'Tuna': 10}
            const ingredient = 'Tuna';
            const number = 10;
            restaurantBudget.addIngredients(warehouses, ingredient, number);
            expect(warehouses[ingredient]).toBe(20);
        });
    });
});
