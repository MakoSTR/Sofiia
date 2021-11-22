const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { main } = require('../../main/main');
const helpers = require("../../helpers/helpers");
const buyAction = require('../../actions/buyAction');
const budgetAction = require('../../actions/budgetAction');
const tableAction = require('../../actions/tableAction');
const orderAction = require('../../actions/orderAction');
const auditAction = require('../../actions/auditAction');

describe('main switcher', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('expect buyAction to have been called',  () => {
        chai.spy.on(buyAction, 'buyAction', () => {});

        const array = ['Buy', 'Alexandra Smith', 'Fries']
        main(array);

        expect(buyAction.buyAction).to.have.been.called();
    });
    test('expect orderAction to have been called',  () => {
        chai.spy.on(orderAction, 'orderAction', () => {});

        const array = ['Order', 'Tuna', '10']
        main(array);

        expect(orderAction.orderAction).to.have.been.called();
    });
    test('expect budgetAction to have been called',  () => {
        chai.spy.on(budgetAction, 'budgetAction', () => {});

        const array = ['Budget', '=', '300']
        main(array);

        expect(budgetAction.budgetAction).to.have.been.called();
    });
    test('expect tableAction to have been called',  () => {
        chai.spy.on(tableAction, 'tableAction', () => {});

        const array = ['Table', 'Alexandra Smith', 'Bernard Unfortunate', 'Irish Fish', 'Fries']
        main(array);

        expect(tableAction.tableAction).to.have.been.called();
    });
    test('expect auditAction to have been called',  () => {
        chai.spy.on(auditAction, 'auditAction', () => {});

        const array = ['Audit', 'Resources']
        main(array);

        expect(auditAction.auditAction).to.have.been.called();
    });
    test('expect disabler to have been called',  () => {
        chai.spy.on(helpers, 'disabler', () => {});

        const array = ['Morningstar', 'Alexandra Smith', 'Fries']
        main(array);

        expect(helpers.disabler).to.have.been.called();
    });
});