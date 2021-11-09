const taxService = require('../servises/taxService');

describe('class TaxService', () => {
    beforeEach(() => {
        taxService.alreadyCollectedTax = 0;
    });
    test('addAlreadyCollectedTax function: tax 0 and sum 100 - should return 0', () => {
        const sum = 100;
        const tax = 0;
        const res = taxService.addAlreadyCollectedTax(sum, tax);
        expect(res).toBe(0);
    });
    test('addAlreadyCollectedTax function:  tax 30 and sum 100 - should return 30', () => {
        const sum = 100;
        const tax = 30;
        const res = taxService.addAlreadyCollectedTax(sum, tax);
        expect(res).toBe(30);
    });
    test('addAlreadyCollectedTax function: tax 30 and sum 0 should return 0', () => {
        const sum = 0;
        const tax = 30;
        const res = taxService.addAlreadyCollectedTax(sum, tax);
        expect(res).toBe(0);
    });
    test('addAlreadyCollectedTax function: tax undefined and sum 100 should return 10', () => {
        const sum = 100;
        const tax = undefined;
        const res = taxService.addAlreadyCollectedTax(sum, tax);
        expect(res).toBe(10);
    });
    test('getProfit function: should 516 - 500 => positive profit', () => {
        const endRestaurantBudget = 516;
        const startRestaurantBudget = 500;
        const res = taxService.getProfit(endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(16);
    });
    test('getProfit function: should 416 - 500 => negative profit', () => {
        const endRestaurantBudget = 416;
        const startRestaurantBudget = 500;
        const res = taxService.getProfit(endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(-84);
    });
    test('getDailyTax function: should return 0 from tax = 0', () => {
        const tax = 0;
        const res = taxService.getDailyTax(tax);
        expect(res).toBe(0);
    });
    test('getDailyTax function: get default tax (20) when tax = undefined', () => {
        const tax = undefined;
        const res = taxService.getDailyTax(tax);
        expect(res).toBe(20);
    });
    test('getDailyTax function: should return tax = 30', () => {
        const tax = 30;
        const res = taxService.getDailyTax(tax);
        expect(res).toBe(30);
    });
    test('dailyTax function: should divide 30 on 100 and return 0,3', () => {
        const tax = 30;
        const res = taxService.dailyTax(tax);
        expect(res).toBe(0.3);
    });
    test('dailyTaxSum function: with positive profit and fixed tax(30) should return 30', () => {
        const tax = 30;
        const endRestaurantBudget = 1000;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(30);
    });
    test('dailyTaxSum function: with positive profit and default tax (20)  should return 20', () => {
        const tax = undefined;
        const endRestaurantBudget = 1000;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(20);
    });
    test('dailyTaxSum function: should return 0 when profit is negative and tax is 30', () => {
        const tax = 30;
        const endRestaurantBudget = 100;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(0);
    });
    test('getTransactionTax function: should return default (10) when tax = undefined', () => {
        const tax = undefined;
        const res = taxService.getTransactionTax(tax);
        expect(res).toBe(10);
    });
    test('dailyTaxSum function: should return 0 when profit is negative and tax is 0', () => {
        const tax = 0;
        const endRestaurantBudget = 100;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(0);
    });
    test('getTransactionTax function: should return 0 when tax = 0', () => {
        const tax = 0;
        const res = taxService.getTransactionTax(tax);
        expect(res).toBe(0);
    });
    test('getTransactionTax function: fixed tax = 40, should return 40', () => {
        const tax = 40;
        const res = taxService.getTransactionTax(tax);
        expect(res).toBe(40);
    });
    test('transactionTax function: should return 0 when tax = 0', () => {
        const tax = 0;
        const res = taxService.transactionTax(tax);
        expect(res).toBe(0);
    });
    test('transactionTax function: should return default (0.1) when tax undefined', () => {
        const tax = undefined;
        const res = taxService.transactionTax(tax);
        expect(res).toBe(0.1);
    });
    test('transactionTax function: should return (0.4) when tax = 40', () => {
        const tax = 40;
        const res = taxService.transactionTax(tax);
        expect(res).toBe(0.4);
    });
    test('transactionTaxSum function: should return 40 when tax = 40', () => {
        const sum = 100
        const tax = 40;
        const res = taxService.transactionTaxSum(sum,tax);
        expect(res).toBe(40);
    });
    test('transactionTaxSum function: should return 0 when tax = 0', () => {
        const sum = 100
        const tax = 0;
        const res = taxService.transactionTaxSum(sum,tax);
        expect(res).toBe(0);
    });
    test('transactionTaxSum function: should return default (10) when tax undefined', () => {
        const sum = 100
        const tax = undefined;
        const res = taxService.transactionTaxSum(sum,tax);
        expect(res).toBe(10);
    });
});