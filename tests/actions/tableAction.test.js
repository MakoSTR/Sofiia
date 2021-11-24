const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { tableAction } = require('../../actions/tableAction');
const helpers = require('../../helpers/helpers');
const kitchenHandler = require("../../handlers/kitchenHandler");
const warehousesService = require("../../servises/warehousesHandler");
const fileReader = require('../../servises/fileReader');
const buyService = require('../../servises/buyService');

describe('table action', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('action !== Table ==> expect disabler to have been call', () => {
        chai.spy.on(helpers, 'disabler', () => {});

        const i = ['Morningstar'];
        const validBudget = true;
        const customers = [];
        const dishes = [];
        const filePathForOutput = '';

        tableAction(i, validBudget, customers, dishes, filePathForOutput);

        expect(helpers.disabler).to.have.been.called();
    });
    test('budget <= 0 => should call sendRestaurantBudget fn', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});

        const i = ['Table'];
        const validBudget = false;
        const customers = [];
        const dishes = [];
        const filePathForOutput = '';

        tableAction(i, validBudget, customers, dishes, filePathForOutput);

        expect(kitchenHandler.sendRestaurantBudget).to.have.been.called();
    });
    test('same customer in the table => ERROR. One person can appear only once at the table.', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
        chai.spy.on(warehousesService, 'getWarehouses', () => ({'Fries': 1, 'Irish Fish': 1}));
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});
        chai.spy.on(helpers, 'createAuditMessage', () => {});
        chai.spy.on(buyService, 'table', () => {});

        const resMessage = 'ERROR. One person can appear only once at the table. So, whole table fails.';
        const i = ['Table', 'Adam Smith', 'Adam Smith', 'Fries'];
        const validBudget = true;
        const customers = ['Alexandra Smith', 'Adam Smith', 'Christian Donnovan'];
        const dishes = ['Irish Fish', 'Fries'];
        const filePathForOutput = '';

        tableAction(i, validBudget, customers, dishes, filePathForOutput);

        expect(warehousesService.checkDishIngredientsInWarehouse).to.have.been.called();
        expect(warehousesService.getWarehouses).to.have.been.called();
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(fileReader.appendFile).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
        expect(kitchenHandler.sendRestaurantBudget).to.have.not.been.called();
        expect(buyService.table).to.have.not.been.called();

        expect(helpers.createAuditMessage).to.have.been.called.with(i, resMessage);
    });
    test('customers < dishes => receive ERROR. One person can have one type of food only', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
        chai.spy.on(warehousesService, 'getWarehouses', () => ({'Fries': 1, 'Irish Fish': 1}));
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});
        chai.spy.on(helpers, 'createAuditMessage', () => {});
        chai.spy.on(buyService, 'table', () => {});

        const resMessage = 'ERROR. One person can have one type of food only. So, whole table fails.';
        const i = ['Table', 'Alexandra Smith', 'Irish Fish', 'Fries'];
        const validBudget = true;
        const customers = ['Alexandra Smith', 'Adam Smith', 'Christian Donnovan'];
        const dishes = ['Irish Fish', 'Fries'];
        const filePathForOutput = '';

        tableAction(i, validBudget, customers, dishes, filePathForOutput);

        expect(warehousesService.checkDishIngredientsInWarehouse).to.have.been.called();
        expect(warehousesService.getWarehouses).to.have.been.called();
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(fileReader.appendFile).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
        expect(kitchenHandler.sendRestaurantBudget).to.have.not.been.called();
        expect(buyService.table).to.have.not.been.called();

        expect(helpers.createAuditMessage).to.have.been.called.with(i, resMessage);
    });
    test('customers > dishes => receive ERROR. Every person needs something to eat', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
        chai.spy.on(warehousesService, 'getWarehouses', () => ({'Fries': 1, 'Irish Fish': 1}));
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});
        chai.spy.on(helpers, 'createAuditMessage', () => {});
        chai.spy.on(buyService, 'table', () => {});

        const resMessage = 'ERROR. Every person needs something to eat. So, whole table fails.';
        const i = ['Table', 'Alexandra Smith', 'Adam Smith', 'Fries'];
        const validBudget = true;
        const customers = ['Alexandra Smith', 'Adam Smith', 'Christian Donnovan'];
        const dishes = ['Irish Fish', 'Fries'];
        const filePathForOutput = '';

        tableAction(i, validBudget, customers, dishes, filePathForOutput);

        expect(warehousesService.checkDishIngredientsInWarehouse).to.have.been.called();
        expect(warehousesService.getWarehouses).to.have.been.called();
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(fileReader.appendFile).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
        expect(kitchenHandler.sendRestaurantBudget).to.have.not.been.called();
        expect(buyService.table).to.have.not.been.called();

        expect(helpers.createAuditMessage).to.have.been.called.with(i, resMessage);
    });
    test('table action with valid values=> buyService.table).to.have.not.been.called()', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
        chai.spy.on(warehousesService, 'getWarehouses', () => ({'Fries': 1, 'Irish Fish': 1}));
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});
        chai.spy.on(helpers, 'createAuditMessage', () => {});
        chai.spy.on(buyService, 'table', () => ({ message: 'success', totalTax: 10, totalSum: 100 }) );

        const i = ['Table', 'Alexandra Smith', 'Adam Smith', 'Fries', 'Irish Fish'];
        const validBudget = true;
        const customers = ['Alexandra Smith', 'Adam Smith', 'Christian Donnovan'];
        const dishes = ['Irish Fish', 'Fries'];
        const filePathForOutput = '';

        tableAction(i, validBudget, customers, dishes, filePathForOutput);

        expect(warehousesService.checkDishIngredientsInWarehouse).to.have.been.called();
        expect(warehousesService.getWarehouses).to.have.been.called();
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(fileReader.appendFile).to.have.not.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
        expect(kitchenHandler.sendRestaurantBudget).to.have.not.been.called();
        expect(buyService.table).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
    });
    test('table action with valid values but empty warehouses => ERROR. Lack of ingredients', () => {
        chai.spy.on(kitchenHandler, 'sendRestaurantBudget', () => {});
        chai.spy.on(warehousesService, 'checkDishIngredientsInWarehouse', () => {});
        chai.spy.on(warehousesService, 'getWarehouses', () => ({'Fries': 0, 'Irish Fish': 0}));
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(fileReader, 'appendFile', () => {});
        chai.spy.on(helpers, 'createAuditMessage', () => {});
        chai.spy.on(buyService, 'table', () => {});

        const error = `ERROR. Lack of ingredients`;
        const i = ['Table', 'Christian Donnovan', 'Adam Smith', 'Fries', 'Irish Fish'];
        const validBudget = true;
        const customers = ['Alexandra Smith', 'Adam Smith', 'Christian Donnovan'];
        const dishes = ['Irish Fish', 'Fries'];
        const filePathForOutput = '';

        tableAction(i, validBudget, customers, dishes, filePathForOutput);

        expect(warehousesService.checkDishIngredientsInWarehouse).to.have.been.called();
        expect(warehousesService.getWarehouses).to.have.been.called();
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(fileReader.appendFile).to.have.been.called();
        expect(helpers.createAuditMessage).to.have.been.called();
        expect(kitchenHandler.sendRestaurantBudget).to.have.not.been.called();
        expect(buyService.table).to.have.not.been.called();

        expect(helpers.createAuditMessage).to.have.been.called.with(i, error);
    });
});
