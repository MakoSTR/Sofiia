const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { auditAction } = require('../../actions/auditAction');
const audit = require("../../servises/audit");
const helpers = require('../../helpers/helpers');

describe('auditAction function', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('audit action === Audit => writeAudit function to have been called ', () => {
        const action = ['Audit'];
        chai.spy.on(audit, 'writeAudit', () => {
            return 'audit was written'
        });
        chai.spy.on(helpers, 'disabler', () => {});

        auditAction(action);
        expect(audit.writeAudit).to.have.been.called();
        expect(helpers.disabler).to.have.not.been.called();
    });
    test('audit action !== Audit => disabler to have been call', () => {
        const action = ['Morningstar'];
        chai.spy.on(audit, 'writeAudit', () => {  return 'audit was written' });
        chai.spy.on(helpers, 'disabler', () => {});
        auditAction(action);
        expect(audit.writeAudit).to.have.not.been.called();
        expect(helpers.disabler).to.have.been.called();
    });
});