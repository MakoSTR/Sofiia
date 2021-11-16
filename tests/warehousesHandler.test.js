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
    test('should return flag: true', () => {
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
    test('should reduce quantity of dish and return 0', () => {
        const warehouses = {'Emperor Chicken': 1, 'Lemon': 15, 'tuna': 1};
        const ingredient = 'Emperor Chicken'
        const res = warehousesHandler.reducer(ingredient, warehouses);
        expect(res).toBe(0);
    });
    test('should reduce quantity of base ingredient and return 14', () => {
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
    test('should return code: Success (for dish)', () => {
        const order = 'Ruby Salad';
        const testWarehouses = {...warehouses};
        const res = warehousesHandler.reduceQuantities(order, testWarehouses);
            expect(res.code).toBe('Success');
    });
    test ('should return code: Success (for base ingredient)', () => {
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
    test('should return array with All Ingredients for Fish In Water includes dish and base ingredients', () => {
        const order = 'Fish In Water';
        const userIngredients = [];
        warehousesHandler.checkAllIngredients(order, userIngredients, warehouses);
        expect(userIngredients[0]).toBe('Tuna');
        expect(userIngredients[1]).toBe('Omega Sauce');
        expect(userIngredients[2]).toBe('Ruby Salad');

    });
    test('should return array with All Ingredients for Ruby Salad includes only base ingredients', () => {
        const order = 'Ruby Salad';
        const userIngredients = [];
        warehousesHandler.checkAllIngredients(order, userIngredients, warehouses);
        expect(userIngredients[0]).toBe('Tomatoes');
        expect(userIngredients[1]).toBe('Vinegar');
        expect(userIngredients[2]).toBe('Chocolate');
        });
});
// describe('addIngredients function', () => {
//     test('should add quantities in the warehouses: 10 + 10', () => {
//         const warehouses = {'Tuna': 10}
//         const ingredient = 'Tuna';
//         const number = 10;
//         warehousesHandler.addIngredients(warehouses, ingredient, number);
//         expect(warehouses[ingredient]).toBe(20);
//     });
//     test('should addIngredients on warehouses (10+23)', () => {
//         const warehouses = {'Asparagus': 10}
//         const ingredient = 'Asparagus';
//         const number = 23;
//         const res = warehousesHandler.addIngredients(warehouses, ingredient, number);
//         expect(res).toBe(33);
//     });
// });

describe('maximum size and warehouses', () => {
    test('checkWarehouseSpace: warehouses are full and ingredients are full => return false, wastedQuantity = number (15); freeSpace = undefined', () => {
        const warehouses = {'Lemon': 10, 'Tuna': 5, 'Milk': 10, 'Tuna Cake': 3};
        const ingredient = 'Lemon';
        const number = 15;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(15);
        expect(res.freeSpace).toBe(undefined);
    });
    test('checkWarehouseSpace: warehouses are full but ingredients have all free space => return false, wastedQuantity = num(1), freeSpace = undefined', () => {
        const warehouses = {'Lemon': 1, 'Tuna': 10, 'Milk': 10, 'Tuna Cake': 3};
        const ingredient = 'Lemon';
        const number = 1;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(1);
        expect(res.freeSpace).toBe(undefined);
    });
    test('checkWarehouseSpace: warehouses are full but ingredients have some free space => return false, wastedQuantity = 11, freeSpace = undefined', () => {
        const warehouses = {'Lemon': 1, 'Tuna': 10, 'Milk': 10, 'Tuna Cake': 3};
        const ingredient = 'Lemon';
        const number = 11;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(11);
        expect(res.freeSpace).toBe(undefined);
    });
    test('checkWarehouseSpace: warehouses have all free space and ingredients are full => return false; wastedQuantity = num(1), freeSpace = undefined', () => {
        const warehouses = {'Lemon': 10, 'Tuna': 1, 'Milk': 1, 'Tuna Cake': 3};
        const ingredient = 'Lemon';
        const number = 1;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(1);
        expect(res.freeSpace).toBe(undefined);
    });
    test('checkWarehouseSpace: warehouses have all free space, ingredients have all free space => return true; wastedQuantity and freeSpace = undefined', () => {
        const warehouses = {'Lemon': 0, 'Tuna': 1, 'Milk': 1, 'Tuna Cake': 3};
        const ingredient = 'Lemon';
        const number = 10;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(true)
        expect(res.wastedQuantity).toBe(undefined);
        expect(res.freeSpace).toBe(undefined);
    });
    test('checkWarehouseSpace: warehouses have all free space, ingredients have some free space => return false; wastedQuantity = 3; freeSpace = 7', () => {
        const warehouses = {'Lemon': 3, 'Tuna': 1, 'Milk': 1, 'Tuna Cake': 3};
        const ingredient = 'Lemon';
        const number = 10;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(3);
        expect(res.freeSpace).toBe(7);
    });
    test('checkWarehouseSpace: warehouses have some free space, ingredients are full => return false; wastedQuantity = 10; freeSpace = undefined', () => {
        const warehouses = {'Lemon': 10, 'Tuna': 1, 'Milk': 1, 'Tuna Cake': 3}; //15
        const ingredient = 'Lemon';
        const number = 10;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(10);
        expect(res.freeSpace).toBe(undefined);
    });
    test('checkWarehouseSpace: warehouses have some free space(5) >, ingredients have some free space(3) => return false; wastedQuantity = 7; freeSpace = 3', () => {
        const warehouses = {'Lemon': 7, 'Tuna': 3, 'Milk': 2, 'Tuna Cake': 3}; //15
        const ingredient = 'Lemon';
        const number = 10;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(7);
        expect(res.freeSpace).toBe(3);
    });
    test('checkWarehouseSpace: warehouses have some free space(3) <, ingredients have some free space(5) => return false; wastedQuantity = 7; freeSpace = 3', () => {
        const warehouses = {'Lemon': 5, 'Tuna': 3, 'Milk': 6, 'Tuna Cake': 3}; //17
        const ingredient = 'Lemon';
        const number = 10;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(7);
        expect(res.freeSpace).toBe(3);
    });
    test('checkWarehouseSpace: warehouses have some free space(5), ingredients have all free space(10) => return false; wastedQuantity = 5; freeSpace = 5', () => {
        const warehouses = {'Lemon': 0, 'Tuna': 10, 'Milk': 2, 'Tuna Cake': 3}; //15
        const ingredient = 'Lemon';
        const number = 10;
        const maxLimit = 10;
        const totalMax = 20;
        const res = warehousesHandler.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        expect(res.res).toBe(false)
        expect(res.wastedQuantity).toBe(5);
        expect(res.freeSpace).toBe(5);
    });
});