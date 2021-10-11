const { getSum, checkAllIngredients, getAllergies } = require('../servises/orderHandler');

describe('getSum func', () => {
    test('sum', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const sumArr = [];

        const res = getSum(userIngredients, sumArr);

        expect(res).toBe(10);
        expect(sumArr).toEqual([4,1,5])
    });

    test('to be defined', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const sumArr = [];
        expect(getSum(userIngredients, sumArr)).toBeDefined();
        expect(getSum(userIngredients, sumArr)).not.toBeUndefined();
    });
});

describe('checkAllIngredients func', () => {
    test('checkAllIngredients', () => {
        const userIngredients = [];
        const res = checkAllIngredients('Ruby Salad', userIngredients);

        // expect(res()).toBe("Tomatoes", "Vinegar", "Chocolate");
        expect(userIngredients[0]).toEqual("Tomatoes");
        expect(userIngredients[1]).toEqual("Vinegar");
        expect(userIngredients[2]).toEqual("Chocolate");
        expect(userIngredients.length).toBe(3);

    });
});

describe('getAllergies func', () => {
    test('getAllergies false', () => {
        const name = 'Julie Mirage';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        expect(getAllergies(name, userIngredients)).toEqual(undefined);
    });
    test('getAllergies true', () => {
        const name = 'Elon Carousel';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        expect(getAllergies(name, userIngredients)).toEqual("Vinegar");
    });
});