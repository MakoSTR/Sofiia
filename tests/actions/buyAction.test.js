const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { buyAction } = require('../../actions/buyAction');
const helpers = require('../../helpers/helpers');
const audit = require("../../servises/audit");
const kitchenHandler = require('../../handlers/kitchenHandler');
const warehousesService = require('../../servises/warehousesHandler');
const buyService = require("../../servises/buyService");
const fileReader = require("../../servises/fileReader");

describe('buyAction', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('buy action !== Buy => disabler to have been call', () => {
        const action = ['Morningstar'];
        chai.spy.on(audit, 'writeAudit', () => {  return 'audit was written' });
        chai.spy.on(helpers, 'disabler', () => {});
        buyAction(action);
        expect(audit.writeAudit).to.have.not.been.called();
        expect(helpers.disabler).to.have.been.called();
    });
    test('buy action === Buy & rest budget <= 0  ==> should call sendRestaurantBudget fn', () => {
        const action = ['Buy', 'Julie Mirage', 'Emperor Chicken'];
        const validBudget = false;
        const filePathForOutput = '';
        const dishes = ['Emperor Chicken'];
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});
        buyAction(action, validBudget, filePathForOutput, dishes);
        expect(kitchenHandler.sendRestaurantBudget).to.have.been.called();
    });
    test('buy action === Buy & rest budget is valid ==> should call auditAction, checkDishIngredientsInWarehouse, buy, createAuditMessage fn & not call sendRestaurantBudget', () => {
        const action = ['Buy', 'Julie Mirage', 'Fries'];
        const validBudget = true;
        const filePathForOutput = '';
        const dishes = ["Chicken", "Fries"];
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
        chai.spy.on(buyService, 'buy', () => ({ res: 'm' }));
        chai.spy.on(helpers, 'createAuditMessage', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});

        buyAction(action, validBudget, filePathForOutput, dishes);
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(warehousesService.checkDishIngredientsInWarehouse).to.have.been.called();
        expect(buyService.buy).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
        expect(kitchenHandler.sendRestaurantBudget).to.have.not.been.called();
    });
    test('food is not exist ==> should return error cook has no idea how to make it', () => {
        const action = ['Buy', 'Julie Mirage', 'Pizza'];
        const validBudget = true;
        const filePathForOutput = '';
        const dishes = ["Chicken", "Fries"];
        const error = `${action[1]} can’t buy ${action[2]}, cook has no idea how to make it`
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(helpers, 'createAuditMessage', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});

        buyAction(action, validBudget, filePathForOutput, dishes);
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called.with(action, error);
    });
});