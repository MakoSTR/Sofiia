const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { budgetAction } = require('../../actions/budgetAction');
const audit = require("../../servises/audit");
const helpers = require('../../helpers/helpers');
const kitchenHandler = require('../../handlers/kitchenHandler');

describe('budgetAction', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('action === Budget => should called auditAction & not called disabler', () => {
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(helpers, 'disabler', () => {});
        const action = ['Budget'];
        const trash = {};
        const filePathForOutput = '';
        budgetAction(action, trash, filePathForOutput);
        expect(kitchenHandler.auditAction).to.have.been.called();
        expect(helpers.disabler).to.have.not.been.called();
    });
    test('action !== Budget => should not called auditAction & called disabler', () => {
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(helpers, 'disabler', () => {});
        const action = ['Morningstar'];
        budgetAction(action);
        expect(kitchenHandler.auditAction).to.have.not.been.called();
        expect(helpers.disabler).to.have.been.called();
    });
});