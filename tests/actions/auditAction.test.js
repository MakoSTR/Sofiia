const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const audit = require("../../servises/audit");
const { auditAction } = require('../../actions/auditAction');
const {expect} = require("chai");

describe('auditAction function', () => {
    test('audit action === Audit => writeAudit function to have been called ', () => {
        const action = ['Audit'];
        chai.spy.on(audit, 'writeAudit', () => {
            return 'audit was written'
        });
        auditAction(action);
        expect(audit.writeAudit).to.have.been.called();
    });
    // test('audit action !== Audit => disabler to have been call', () => {
    //     const action = ['eriufhasdjn'];
    //     chai.spy.on(audit, 'writeAudit', () => {});
    //     auditAction(action);
    //     expect(audit.writeAudit).spy.should.have.not.been.called();
    // });
});