const { getSum, checkAllIngredients, getAllergies } = require('../servises/orderHandler');

describe('getSum function', () => {
    test('should add all the ingredients in the array', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const res = getSum(userIngredients);
        expect(res).toBe(10);
    });
    test('should be defined', () => {
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        const sumArr = [];
        expect(getSum(userIngredients, sumArr)).toBeDefined();
        expect(getSum(userIngredients, sumArr)).not.toBeUndefined();
    });
});

describe('checkAllIngredients function', () => {
    test('should contain all ingredients', () => {
        const userIngredients = [];
        const res = checkAllIngredients('Ruby Salad', userIngredients);
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
        const foundAllergies = getAllergies(name, userIngredients);
        expect(foundAllergies).toHaveLength(0);
    });
    test('should return the allergy', () => {
        const name = 'Elon Carousel';
        const userIngredients = ["Tomatoes", "Vinegar", "Chocolate"];
        expect(getAllergies(name, userIngredients)).toEqual(["Vinegar"]);
    });
});