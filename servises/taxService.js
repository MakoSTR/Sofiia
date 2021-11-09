class TaxService {
    constructor() {
        this.alreadyCollectedTax = 0;
    }
    getAlreadyCollectedTax = () => {
        return this.alreadyCollectedTax;
    }

    addAlreadyCollectedTax = (sum, tax) => {
        const transactionTaxSum = this.transactionTaxSum(sum, tax);
        return this.alreadyCollectedTax += transactionTaxSum;
    }

    getProfit = (endRestaurantBudget, startRestaurantBudget) => {
        return endRestaurantBudget - startRestaurantBudget - this.alreadyCollectedTax
    }

    getDailyTax = tax => {
        return tax >= 0 ? tax : 20
    }

    dailyTax = tax => {
        const getTax = this.getDailyTax(tax)
        return getTax/100
    }

    dailyTaxSum = (tax, endRestaurantBudget, startRestaurantBudget) => {
        const getProfit = this.getProfit(endRestaurantBudget, startRestaurantBudget)
        const dailyTax = this.dailyTax(tax)
        const dailyTaxSum = Math.round((getProfit * dailyTax)*100) / 100;
        return dailyTaxSum > 0 ? dailyTaxSum : 0
    }

    getTransactionTax = tax => {
        return tax >= 0 ? tax : 10
    }

    transactionTax = tax => {
        const getTax = this.getTransactionTax(tax)
        return getTax/100
    }

    transactionTaxSum = (sum, tax) => {
        const transactionTax = this.transactionTax(tax)
        return Math.ceil(sum * transactionTax)
    }
}

const taxService = new TaxService();

module.exports = taxService;