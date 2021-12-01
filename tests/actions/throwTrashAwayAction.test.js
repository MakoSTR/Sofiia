const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const {expect} = require("chai");

const { throwTrashAwayAction } = require('../../actions/throwTrashAwayAction');
const audit = require("../../servises/audit");
const helpers = require("../../helpers/helpers");
const fileReader = require("../../servises/fileReader");
const trashService = require("../../servises/trashService");
const kitchenHandler = require("../../handlers/kitchenHandler");

describe('throwTrashAwayAction', () => {
    afterEach(() => {
        chai.spy.restore();
    });
    test('throwTrashAway action !== throwTrashAwayAction => disabler to have been called', () => {
        const action = ['Morningstar'];
        chai.spy.on(audit, 'writeAudit', () => {  return 'audit was written' });
        chai.spy.on(helpers, 'disabler', () => {});
        throwTrashAwayAction(action);
        expect(audit.writeAudit).to.have.not.been.called();
        expect(helpers.disabler).to.have.been.called();
    });
    test('throwTrashAway in input => throwTrashAway to have been called', () => {
        chai.spy.on(audit, 'writeAudit', () => {  return 'audit was written' });
        chai.spy.on(fileReader, 'appendFile', () => {});
        chai.spy.on(fileReader, 'writeFile', () => {});
        chai.spy.on(kitchenHandler, 'auditAction', () => {});
        chai.spy.on(trashService, 'cleaner', () => {});

        const action = ['Throw trash away'];
        const filePathForOutput = '';

        throwTrashAwayAction(action, filePathForOutput);

        expect(trashService.cleaner).to.have.been.called();
        expect(fileReader.writeFile).to.have.been.called();
    })
});