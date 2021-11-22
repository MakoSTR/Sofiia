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
        const action = ['Buy'];
        const validBudget = false;
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        buyAction(action, validBudget);
        expect(kitchenHandler.sendRestaurantBudget).to.have.been.called();
    });
    test('buy action === Buy & rest budget is valid ==> should call auditAction, checkDishIngredientsInWarehouse, buy, createAuditMessage fn & not call sendRestaurantBudget', () => {
        const action = ['Buy'];
        const validBudget = true;
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
        chai.spy.on(buyService, 'buy', () => ({ res: 'm' }));
        chai.spy.on(helpers, 'createAuditMessage', () => {});

        buyAction(action, validBudget);
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(warehousesService.checkDishIngredientsInWarehouse).to.have.been.called();
        expect(buyService.buy).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
        expect(kitchenHandler.sendRestaurantBudget).to.have.not.been.called();
    });
});