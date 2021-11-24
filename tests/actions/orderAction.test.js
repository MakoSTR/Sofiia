const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { checkIsMalformedRecord, dividedArray, checkIsDishForAll, checkIsIngredientForAll, orderAction } = require('../../actions/orderAction');
const helpers = require("../../helpers/helpers");
const kitchenHandler = require("../../handlers/kitchenHandler");
const warehousesService = require("../../servises/warehousesHandler");
const fileReader = require("../../servises/fileReader");

describe('check is malformed record exist', () => {
    test('malformed record not exist => receive an empty array', () => {
        // given
        const i = ['Order', 'Tuna', '10', 'Potatoes', '5', 'Sunflower seeds', '7'];

        //when
        const res = checkIsMalformedRecord(i);

        //then
        expect(res.length).equal(0);
    });
    test('malformed record exist => receive an array with malformed rec', () => {
        // given
        const i = ['Order', 'Tuna', '10', 'Potatoes', '5', 'Sunflower seeds'];

        //when
        const res = checkIsMalformedRecord(i);

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
        const res = dividedArray(i);

        //then
        expect(res.length).equal(1);
        expect(res[0][0]).equal('Tuna');
        expect(res[0][1]).equal('10');
    });
    test('array have 4 rec ==> receive the same array', () => {
        // given
        const i = ['Order', 'Tuna', '10', 'Fries', '1'];

        //when
        const res = dividedArray(i);

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
        const res = dividedArray(i);

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
        const res = checkIsDishForAll(i);
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
        const res = checkIsDishForAll(i);
        //then
        expect(res.length).equal(0);
    });
    test('some from input data is dish => receive an array with that data ', () => {
        // given
        const i = ['Order', 'Princess Chicken', '2', 'Potatoes', '10'];
        //when
        const res = checkIsDishForAll(i);
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
        const res = checkIsIngredientForAll(i);
        //then
        expect(res.length).equal(0);
    });
    test('no one from input data is dish => receive the same array ', () => {
        // given
        const i = ['Order', 'Potatoes', '10'];
        //when
        const res = checkIsIngredientForAll(i);
        //then
        expect(res.length).equal(1);
        expect(res[0][0]).equal('Potatoes');
        expect(res[0][1]).equal('10');
    });
    test('some from input data is ingredient => receive an array with that data ', () => {
        // given
        const i = ['Order', 'Princess Chicken', '2', 'Potatoes', '10'];
        //when
        const res = checkIsIngredientForAll(i);
        //then
        expect(res.length).equal(1);
        expect(res[0][0]).equal('Potatoes');
        expect(res[0][1]).equal('10');
    });
});

describe('order action', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    // test('action !== Order ==> expect disabler to have been call', () => {
    //     chai.spy.on(helpers, 'disabler', () => {});
    //     // given
    //     const i = ['Morningstar', 'Tuna', '10', 'Potatoes', '1'];
    //     const validBudget = true;
    //     const filePathForOutput = '';
    //     const command = {"order": "no"};
    //     //when
    //     orderAction(i, validBudget, filePathForOutput, command)
    //     //then
    //     expect(helpers.disabler).to.have.been.called();
    // });
    test('budget <= 0 ==> should call sendRestaurantBudget fn', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        // given
        const i = ['Order', 'Tuna', '10', 'Potatoes', '1'];
        const validBudget = false;
        const filePathForOutput = '';
        const command = {"order": "ingredients"}
        //when
        orderAction(i, validBudget, filePathForOutput, command)
        //then
        expect(kitchenHandler.sendRestaurantBudget).to.have.been.called();
    });
    // test('all orders is base ing & congig is ing ==> kitchenHandler.order).to.have.been.called', () => {
    //     chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
    //     chai.spy.on(warehousesService, 'getWarehouses', () => ({'Tuna': 1, 'Potatoes': 1}));
    //     chai.spy.on(kitchenHandler, 'auditAction', () => {});
    //     chai.spy.on(kitchenHandler, 'order', () => {});
    //     chai.spy.on(fileReader, 'appendFile', () => {});
    //     chai.spy.on(helpers, 'createAuditMessage', () => {});
    //     // given
    //     const i = ['Order', 'Tuna', '1', 'Potatoes', '1'];
    //     const validBudget = true;
    //     const filePathForOutput = '';
    //     const command = {"order": "ingredients"}
    //     //when
    //     orderAction(i, validBudget, filePathForOutput, command)
    //     //then
    //     expect(kitchenHandler.order).to.have.been.called();
    //     expect(kitchenHandler.auditAction).to.have.been.called();
    //     expect(fileReader.appendFile).to.have.been.called();
    // });
    // test('', () => {
    //
    // });
    // test('', () => {
    //
    // });
});