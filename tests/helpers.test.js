const { createAuditMessage, disabler } = require('../helpers/helpers');

describe('Helpers', () => {
    test('createAuditMessage fn length = 3', () => {
        const inputArr = ["Buy", "Alexandra Smith", "Fries"];
        const resMessage = 'res for test'
        const res = createAuditMessage(inputArr, resMessage)
        expect(res).toBe('Buy,Alexandra Smith,Fries => res for test')
    });
    test('createAuditMessage fn length = 2', () => {
        const inputArr = ["Buy", "Alexandra Smith"];
        const resMessage = 'res for test'
        const res = createAuditMessage(inputArr, resMessage)
        expect(res).toBe('Buy,Alexandra Smith => res for test')
    });
    test('disabler message for Buy', () => {
        const i = ['Buy', 'Alexandra Smith', 'Fries'];
        const res = disabler(i)
        expect(res).toBe('Buy command disabled')
    });
    test('disabler message for Audit', () => {
        const i = ['Audit', 'Resources'];
        const res = disabler(i)
        expect(res).toBe('Audit command disabled')
    });
})