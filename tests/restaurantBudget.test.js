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
        test('should subtract 300 from budget', () => {
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
        test('should add (100 - tax 0%) to budget when tax = 0', () => {
            const name = 'Alexandra Smith';
            const discountValue = 10;
            const sum = 100;
            const tax = 0;
            const res = restaurantBudget.increaseRestaurantBudget(name, sum, tax, discountValue);
            expect(res).toBe(600);
        });
        test('should add (100 - tax 10%(default)) to budget (when tax is undefined), ', () => {
            const name = 'Alexandra Smith';
            const discountValue = 10;
            const sum = 100;
            const tax = undefined;
            const res = restaurantBudget.increaseRestaurantBudget(name, sum, tax, discountValue);
            expect(res).toBe(590);
        });
        test('should add (100 - tax 20%) to budget', () => {
            const name = 'Alexandra Smith';
            const discountValue = 10;
            const sum = 100;
            const tax = 20;
            const res = restaurantBudget.increaseRestaurantBudget(name, sum, tax, discountValue);
            expect(res).toBe(580);
        });
    });

    describe('decreaseRestaurantBudget function', () => {
        test('decreaseRestaurantBudget: price of Tuna(25) subtract on number(10) + default tax 0%', () => {
            const ingredient = 'Tuna';
            const number = 10;
            const tax = 0;
            restaurantBudget.decreaseRestaurantBudget(ingredient, number, tax);
            expect(restaurantBudget.restaurantBudget).toBe(250);
        });
        test('decreaseRestaurantBudget: price of Tuna(25) subtract on number(10) + 30% tax', () => {
            const ingredient = 'Tuna';
            const number = 10;
            const tax = 30;
            restaurantBudget.decreaseRestaurantBudget(ingredient, number, tax);
            expect(restaurantBudget.restaurantBudget).toBe(175);
        });
        test('decreaseRestaurantBudget: price of Tuna(25) subtract on number(10) + 10% tax(default) when tax is undefined', () => {
            const ingredient = 'Tuna';
            const number = 10;
            const tax = undefined;
            restaurantBudget.decreaseRestaurantBudget(ingredient, number, tax);
            expect(restaurantBudget.restaurantBudget).toBe(225);
        });
    });

    describe('order function', () => {
        test('should multiply price of Tuna on quantity => 25*10', () => {
            const ingredient = 'Tuna';
            const number = 10;
            const res = restaurantBudget.order(ingredient, number);
            expect(res).toBe(250);
        });
    });
});
