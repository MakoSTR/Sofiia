const warehousesHandler = require('../servises/warehousesHandler');

const warehouses = {
    "Milk": 3,
    "Honey": 23,
    "Paprika": 21,
    "Garlic": 21,
    "Water": 21,
    "Lemon": 0,
    "Tomatoes": 0,
    "Pickles": 21,
    "Ruby Salad": 1,
    "Fish In Water": 1,
    "Vinegar": 0,
    "Chocolate": 0,
    "Tuna": 1,
    "Youth Sauce": 0,
    "Omega Sauce": 1,
    "Emperor Chicken": 0
};

describe('checkIsBaseIngredient func', () => {
    beforeEach(() => {
        warehousesHandler.setWarehouses(warehouses);
    });
    test('should return base ingredient', () => {
        const order = 'Tuna';
        const res = warehousesHandler.checkIsBaseIngredient(order);
        expect(res[0]).toBe('Tuna');
    });
    test('should return an empty array', () => {
        const order = 'Emperor Chicken';
        const res = warehousesHandler.checkIsBaseIngredient(order);
        expect(res.length).toBe(0);
    });
});

describe('checkIsDish func', () => {
    beforeEach(() => {
        warehousesHandler.setWarehouses(warehouses);
    });
    test('should return dish', () => {
        const order = 'Emperor Chicken';
        const res = warehousesHandler.checkIsDish(order);
        expect(res[0]).toBe('Emperor Chicken');
    });
    test('should return an empty array', () => {
        const order = 'Tuna';
        const res = warehousesHandler.checkIsDish(order);
        expect(res.length).toBe(0);
    });
});

describe('checkQuantitiesOfIngredients func', () => {
    beforeEach(() => {
        warehousesHandler.setWarehouses(warehouses);
    })
    test('should return code: Success', () => {
        const order = 'Emperor Chicken';
        const res = warehousesHandler.checkQuantitiesOfIngredients(order);
        expect(res.flag).toBe(true);
    });
    test('should return message: lack of ingredients', () => {
        const order = 'Tuna Cake';
        const res = warehousesHandler.checkQuantitiesOfIngredients(order);
        expect(res.message).toBe('lack of ingredients');
    });
});

describe('reducer func', () => {
    beforeEach(() => {
        warehousesHandler.setWarehouses(warehouses);
    })
    test('should return 0', () => {
        const warehouses = {'Emperor Chicken': 1, 'Lemon': 15, 'tuna': 1};
        const ingredient = 'Emperor Chicken'
        const res = warehousesHandler.reducer(ingredient, warehouses);
        expect(res).toBe(0);
    });
    test('should return 14', () => {
        const warehouses = {'Lemon': 15, 'tuna': 1};
        const ingredient = 'Lemon'
        const res = warehousesHandler.reducer(ingredient, warehouses);
        expect(res).toBe(14);
    });
});

describe('reduceQuantities func', () => {
    beforeEach(() => {
        warehousesHandler.setWarehouses(warehouses);
    })
    test('should return code: Success', () => {
        const order = 'Ruby Salad';
        const testWarehouses = {...warehouses};
        const res = warehousesHandler.reduceQuantities(order, testWarehouses);
            expect(res.code).toBe('Success');
    });
    test ('should return code: Success', () => {
        const order = 'Tuna';
        const testWarehouses = {...warehouses};
        const res = warehousesHandler.reduceQuantities(order, testWarehouses);
        expect(res.code).toBe(`Success`);
        expect(res.message).toBe(`${order}(ing) was on the warehouses: quantities reduced`);
    });
    test('should return: warehouses is empty', () => {
        const order = 'Lemon';
        const testWarehouses = {...warehouses};
        const res = warehousesHandler.reduceQuantities(order, testWarehouses);
        expect(res).toBe('warehouses is empty');
    });
});

describe('checkAllIngredients func', () => {
    beforeEach(() => {
        warehousesHandler.setWarehouses(warehouses);
    })
    test('Fish In Water', () => {
        const order = 'Fish In Water';
        const userIngredients = [];
        warehousesHandler.checkAllIngredients(order, userIngredients, warehouses);
        expect(userIngredients[0]).toBe('Tuna');
        expect(userIngredients[1]).toBe('Omega Sauce');
        expect(userIngredients[2]).toBe('Ruby Salad');

    });
    test('Ruby Salad - Tomatoes', () => {
    const order = 'Ruby Salad';
    const userIngredients = [];
    warehousesHandler.checkAllIngredients(order, userIngredients, warehouses);
    expect(userIngredients[0]).toBe('Tomatoes');
    expect(userIngredients[1]).toBe('Vinegar');
    expect(userIngredients[2]).toBe('Chocolate');
    });
});