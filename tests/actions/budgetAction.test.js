const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { budgetAction } = require('../../actions/budgetAction');
const audit = require("../../servises/audit");

describe('budgetAction', () => {
    test('should return ... ', () => {
    //     const action = ['Budget'];
    //     budgetAction(action);
    //     chai.spy.on(audit, 'writeAudit', () => {
    //         return 'audit was written'
    //     });
    //     expect(audit.writeAudit).to.have.been.called();
    });
});