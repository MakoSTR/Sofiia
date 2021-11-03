const audit = require('../servises/audit');

describe('audit', () => {
    test('addToAudit fn', () => {
        const auditData =  { res: 'res', budget: 123};
        audit.addToAudit(auditData)
        expect(auditData.res).toBe('res')
        expect(auditData.budget).toBe(123)
        expect(Object.keys(auditData)).toHaveLength(2)
    })
})