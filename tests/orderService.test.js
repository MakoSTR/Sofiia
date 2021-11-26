const orderService = require('../servises/orderService');
const {expect} = require("chai");

describe('order service', () => {
    test('sumForKeepedOrder fn should return sum and extra sum for 1 ingredient', () => {
        const ingredients = ['Tuna'];
        const margin = 0;
        const transactionTax = 0;
        const res = orderService.sumForKeepedOrder(ingredients, margin, transactionTax);
        expect(res.orderSum).equal(25);
        expect(res.extraSum).equal(6.25);
    });
    test('sumForKeepedOrder fn should return sum and extra sum for some ingredients', () => {
        const ingredients = ['Tuna', 'Tuna', 'Potatoes' ];
        const margin = 0;
        const transactionTax = 0;
        const res = orderService.sumForKeepedOrder(ingredients, margin, transactionTax);
        expect(res.orderSum).equal(53);
        expect(res.extraSum).equal(13.25);
    });
});

describe('check is malformed record exist', () => {
    test('malformed record not exist => receive an empty array', () => {
        // given
        const i = ['Order', 'Tuna', '10', 'Potatoes', '5', 'Sunflower seeds', '7'];
        //when
        const res = orderService.checkIsMalformedRecord(i);

        //then
        expect(res.length).equal(0);
    });
    test('malformed record exist => receive an array with malformed rec', () => {
        // given
        const i = ['Order', 'Tuna', '10', 'Potatoes', '5', 'Sunflower seeds'];

        //when
        const res = orderService.checkIsMalformedRecord(i);

        //then
        expect(res.length).equal(1);
        expect(res[0]).equal('Sunflower seeds');
    });
});

describe('dividedArray', () => {
    test('array have only 2 rec ==> receive the same array', () => {
        // given
        const i = ['Order', 'Tuna', '10'];

        //when
        const res = orderService.dividedArray(i);

        //then
        expect(res.length).equal(1);
        expect(res[0][0]).equal('Tuna');
        expect(res[0][1]).equal('10');
    });
    test('array have 4 rec ==> receive the same array', () => {
        // given
        const i = ['Order', 'Tuna', '10', 'Fries', '1'];

        //when
        const res = orderService.dividedArray(i);

        //then
        expect(res.length).equal(2);
        expect(res[0][0]).equal('Tuna');
        expect(res[0][1]).equal('10');
        expect(res[1][0]).equal('Fries');
        expect(res[1][1]).equal('1');
    });
    test('array have 3 rec ==> receive the same array', () => {
        // given
        const i = ['Order', 'Tuna', '10', 'Fries'];

        //when
        const res = orderService.dividedArray(i);

        //then
        expect(res.length).equal(2);
        expect(res[0][0]).equal('Tuna');
        expect(res[0][1]).equal('10');
        expect(res[1][0]).equal('Fries');
    });
});

describe('checkIsDishForAll', () => {
    test('all input data is dish => receive the same array', () => {
        // given
        const i = ['Order', 'Princess Chicken', '10', 'Fries', '1'];

        //when
        const res = orderService.checkIsDishForAll(i);
        //then
        expect(res.length).equal(2);
        expect(res[0][0]).equal('Princess Chicken');
        expect(res[0][1]).equal('10');
        expect(res[1][0]).equal('Fries');
        expect(res[1][1]).equal('1');

    });
    test('no one from input data is dish => receive an empty array ', () => {
        // given
        const i = ['Order', 'Potatoes', '10'];
        //when
        const res = orderService.checkIsDishForAll(i);
        //then
        expect(res.length).equal(0);
    });
    test('some from input data is dish => receive an array with that data ', () => {
        // given
        const i = ['Order', 'Princess Chicken', '2', 'Potatoes', '10'];
        //when
        const res = orderService.checkIsDishForAll(i);
        //then
        expect(res.length).equal(1);
        expect(res[0][0]).equal('Princess Chicken');
        expect(res[0][1]).equal('2');
    });
});

describe('checkIsIngredientForAll', () => {
    test('all input data is dish => receive the an empty array', () => {
        // given
        const i = ['Order', 'Princess Chicken', '10', 'Fries', '1'];

        //when
        const res = orderService.checkIsIngredientForAll(i);
        //then
        expect(res.length).equal(0);
    });
    test('no one from input data is dish => receive the same array ', () => {
        // given
        const i = ['Order', 'Potatoes', '10'];
        //when
        const res = orderService.checkIsIngredientForAll(i);
        //then
        expect(res.length).equal(1);
        expect(res[0][0]).equal('Potatoes');
        expect(res[0][1]).equal('10');
    });
    test('some from input data is ingredient => receive an array with that data ', () => {
        // given
        const i = ['Order', 'Princess Chicken', '2', 'Potatoes', '10'];
        //when
        const res = orderService.checkIsIngredientForAll(i);
        //then
        expect(res.length).equal(1);
        expect(res[0][0]).equal('Potatoes');
        expect(res[0][1]).equal('10');
    });
});