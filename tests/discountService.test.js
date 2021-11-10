const discountService = require('../servises/discountService');

describe('discount service', () => {
    beforeEach(() => {
        discountService.personAppears = [];
    })
    test('addPerson function: should add some data to array', () => {
        const data = 'Person'
        discountService.addPerson(data)
        expect(discountService.personAppears[0]).toBe('Person')
        expect(discountService.personAppears).toHaveLength(1);
    });
    test('checkEvery3Appears function: should return true, when amount of appears % = 0: case 3 appears', () => {
        const name = 'Person name'
        discountService.personAppears = ['Person name','Person name','Person name','Other Person name']
        expect(discountService.checkEvery3Appears(name)).toBe(true)
    });
    test('checkEvery3Appears function: should return true, when amount of appears % = 0: case 6 appears', () => {
        const name = 'Person name'
        discountService.personAppears = ['Person name','Person name','Person name','Other Person name','Person name','Person name','Person name']
        expect(discountService.checkEvery3Appears(name)).toBe(true)
    });
    test('checkEvery3Appears function: should return false, case: 1 appear', () => {
        const name = 'Other Person name'
        discountService.personAppears = ['Person name','Person name','Person name','Other Person name']
        expect(discountService.checkEvery3Appears(name)).toBe(false)
    });
    test('getDiscount function: should return discount of 20', () => {
        const discount = 20;
        const res = discountService.getDiscount(discount)
        expect(res).toBe(20);
    });
    test('getDiscount function: should return discount of 0 (default) when discount undefined', () => {
        const discount = undefined;
        const res = discountService.getDiscount(discount)
        expect(res).toBe(0);
    });
    test('discount function: should return discount of 0.2 when discount = 20', () => {
        const discount = 20;
        const res = discountService.discount(discount)
        expect(res).toBe(0.2);
    });
    test('discount function: should return discount of 0 (default) when discount undefined', () => {
        const discount = undefined;
        const res = discountService.discount(discount)
        expect(res).toBe(0);
    });
    test('discountSum function: should return discount 10', () => {
        const sum = 100
        const discount = 10;
        const res = discountService.discountSum(sum, discount)
        expect(res).toBe(10);
    });
    test('discountSum function: should return 0 (default)', () => {
        const sum = 100
        const discount = undefined;
        const res = discountService.discountSum(sum, discount)
        expect(res).toBe(0);
    });
    test('makeDiscount function: should return ', () => {
        discountService.personAppears = ['Person name','Person name','Person name','Other Person name'];
        const name = 'Person name';
        const sum = 100
        const discount = 20;
        const res = discountService.makeDiscount(name, sum, discount)
        expect(res).toBe(20);
    });
    test('makeDiscount function: should return false', () => {
        discountService.personAppears = ['Person name','Person name','Person name','Other Person name'];
        const name = 'Other Person name';
        const sum = 100
        const discount = 10;
        const res = discountService.makeDiscount(name, sum, discount)
        expect(res).toBe(false);
    });
});