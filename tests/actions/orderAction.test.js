const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const kitchenHandler = require("../../handlers/kitchenHandler");
const helpers = require('../../helpers/helpers');
const { orderAction } = require('../../actions/orderAction');

describe('order action', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('action !== Order ==> expect disabler to have been call', () => {
        chai.spy.on(helpers, 'disabler', () => {});
        // given
        const i = ['Morningstar', 'Tuna', '10', 'Potatoes', '1'];
        const validBudget = true;
        const filePathForOutput = '';
        const command = {"order": "no"};
        const food = ['Fries'];
        const base = ['Tuna', 'Potatoes'];
        const trash = {};
        //when
        orderAction(i, validBudget, filePathForOutput, command, food, base, trash)
        //then
        expect(helpers.disabler).to.have.been.called();
    });
    test('budget <= 0 ==> should call sendRestaurantBudget fn', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        // given
        const i = ['Order', 'Tuna', '10', 'Potatoes', '1'];
        const validBudget = false;
        const filePathForOutput = '';
        const command = {"order": "ingredients"}
        const food = ['Fries'];
        const base = ['Tuna', 'Potatoes'];
        const trash = {};
        //when
        orderAction(i, validBudget, filePathForOutput, command, food, base, trash)
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