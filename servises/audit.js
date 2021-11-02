const FileReader = require('./fileReader');

const fileReader = new FileReader();
const filePathForAudit = './resources/output_files/audit.txt';

class Audit {
    constructor() {
        this.auditData = [];
    }

    init = () => {
        const message =
            `INIT
            Warehouses: ${JSON.stringify(this.auditData[0].initialWarehouses)}
            Restaurant Budget: ${this.auditData[0].initialBudget}\r\n
            START
            `
        ;
        fileReader.appendFile(filePathForAudit, message)
    }

    end = () => {
        fileReader.appendFile(filePathForAudit, `AUDIT END`)
    };

    writeAudit = () => {
        this.init();
        this.auditData.splice(0, 1);

        this.auditData.forEach(audit => {
            const budgetRes = audit.budget > 0 ? audit.budget : 'RESTAURANT BANKRUPT';

            const message =
                `command: => ${audit.res}
            Warehouse: ${JSON.stringify(audit.warehouses)}
            Restaurant Budget: ${budgetRes}`;
            fileReader.appendFile(filePathForAudit, message)
        })

        this.end();
    }

    addToAudit = (audit) => {
        this.auditData.push(audit);
    }
}

const audit = new Audit();

module.exports = audit;
