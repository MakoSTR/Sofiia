const orderService = require('../servises/orderService');

describe('order service', () => {
    test('sumForKeepedOrder fn should return sum and extra sum for 1 ingredient', () => {
        const ingredients = ['Tuna'];
        const margin = 0;
        const transactionTax = 0;
        const res = orderService.sumForKeepedOrder(ingredients, margin, transactionTax);
        expect(res.orderSum).toBe(25);
        expect(res.extraSum).toBe(6.25);
    });
    test('sumForKeepedOrder fn should return sum and extra sum for some ingredients', () => {
        const ingredients = ['Tuna', 'Tuna', 'Potatoes' ];
        const margin = 0;
        const transactionTax = 0;
        const res = orderService.sumForKeepedOrder(ingredients, margin, transactionTax);
        expect(res.orderSum).toBe(53);
        expect(res.extraSum).toBe(13.25);
    });
});