const fileReader = require('./fileReader');
const taxService = require("../servises/taxService");
const buyService = require("../servises/buyService")
const restaurantBudget = require("./restaurantBudget")

const filePathForAudit = './resources/output_files/audit.txt';

class Audit {
    constructor() {
        this.auditData = [];
    }

    init = () => {
        const message =
            `INIT
            Warehouses: ${JSON.stringify(this.auditData[0].initialWarehouses)}
            Restaurant Budget: ${this.auditData[0].initialBudget}
            Daily Tax: ${this.auditData[0].initialDailyTax}\r\n
            START
            `
        ;
        fileReader.appendFile(filePathForAudit, message)
    }

    end = (tax, endRestaurantBudget, startRestaurantBudget) => {
        const dailyTaxSum = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        const message = `DAILY TAX: ${dailyTaxSum}\n
        AUDIT END`
        fileReader.appendFile(filePathForAudit, message)
    };

    writeAudit = (tax) => {
        var i = 0;
        console.log(restaurantBudget.array)

        this.init();
        this.auditData.splice(0, 1);

        this.auditData.forEach(audit => {
            const budgetRes = audit.budget > 0 ? audit.budget : 'RESTAURANT BANKRUPT';
            // if ()

            const message =
                `command: => ${audit.res}
            Warehouse: ${JSON.stringify(audit.warehouses)}
            Restaurant Budget: ${budgetRes}
            All Transaction Tax: ${audit.transactionTax}
            Trash: ${JSON.stringify(audit.trash)}
            Tips: ${JSON.stringify(buyService.getTips(restaurantBudget.array[i]))}
            Volatility: ${restaurantBudget.array[i]}`;
            i++
            fileReader.appendFile(filePathForAudit, message)
        })
        const endRestaurantBudget = this.auditData[this.auditData.length - 1].budget;
        this.end(tax, endRestaurantBudget, 500);
    }

    addToAudit = (audit) => {
        this.auditData.push(audit);
    }
}

const audit = new Audit();

module.exports = audit;
