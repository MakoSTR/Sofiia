const { createAuditMessage, disabler } = require('../helpers/helpers');

describe('Helpers', () => {
    test('createAuditMessage function with length = 3 => should return array with arrow(=>) and message ', () => {
        const inputArr = ["Buy", "Alexandra Smith", "Fries"];
        const resMessage = 'res for test'
        const res = createAuditMessage(inputArr, resMessage)
        expect(res).toBe('Buy,Alexandra Smith,Fries => res for test')
    });
    test('createAuditMessage function with length = 2 =>  should return array with arrow(=>) and message ', () => {
        const inputArr = ["Buy", "Alexandra Smith"];
        const resMessage = 'res for test'
        const res = createAuditMessage(inputArr, resMessage)
        expect(res).toBe('Buy,Alexandra Smith => res for test')
    });
    test('disabler function should return message for Buy', () => {
        const i = ['Buy', 'Alexandra Smith', 'Fries'];
        const res = disabler(i)
        expect(res).toBe('Buy command disabled')
    });
    test('disabler function should return message message for Audit', () => {
        const i = ['Audit', 'Resources'];
        const res = disabler(i)
        expect(res).toBe('Audit command disabled')
    });
})