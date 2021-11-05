const taxService = require('../servises/taxService');
const restaurantBudget = require("../servises/restaurantBudget");

describe('class TaxService', () => {
    beforeEach(() => {
        taxService.alreadyCollectedTax = 0;
    });
    test('addAlreadyCollectedTax fn /default tax 10%', () => {
        const sum = 100;
        const tax = 0;
        const res = taxService.addAlreadyCollectedTax(sum, tax);
        expect(res).toBe(10);
    });
    test('addAlreadyCollectedTax fn /fixed tax 30%', () => {
        const sum = 100;
        const tax = 30;
        const res = taxService.addAlreadyCollectedTax(sum, tax);
        expect(res).toBe(30);
    });
    test('addAlreadyCollectedTax fn /fixed tax 30% / sum 0', () => {
        const sum = 0;
        const tax = 30;
        const res = taxService.addAlreadyCollectedTax(sum, tax);
        expect(res).toBe(0);
    });
    test('getProfit fn / profit positive', () => {
        const endRestaurantBudget = 516;
        const startRestaurantBudget = 500;
        const res = taxService.getProfit(endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(16);
    });
    test('getProfit fn / profit negative', () => {
        const endRestaurantBudget = 416;
        const startRestaurantBudget = 500;
        const res = taxService.getProfit(endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(-84);
    });
    test('getDailyTax / get default tax', () => {
        const tax = 0;
        const res = taxService.getDailyTax(tax);
        expect(res).toBe(20);
    });
    test('getDailyTax / get tax', () => {
        const tax = 30;
        const res = taxService.getDailyTax(tax);
        expect(res).toBe(30);
    });
    test('dailyTax fn', () => {
        const tax = 30;
        const res = taxService.dailyTax(tax);
        expect(res).toBe(0.3);
    });
    test('dailyTaxSum fn / positive profit / fixed tax', () => {
        const tax = 30;
        const endRestaurantBudget = 1000;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(30);
    });
    test('dailyTaxSum fn / positive profit / default tax', () => {
        const tax = 0;
        const endRestaurantBudget = 1000;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(20);
    });
    test('dailyTaxSum fn / negative profit / fixed tax', () => {
        const tax = 30;
        const endRestaurantBudget = 100;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(0);
    });
    test('dailyTaxSum fn / negative profit / default tax', () => {
        const tax = 0;
        const endRestaurantBudget = 100;
        const startRestaurantBudget = 900;
        const res = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        expect(res).toBe(0);
    });
    test('getTransactionTax fn / default tax', () => {
        const tax = 0;
        const res = taxService.getTransactionTax(tax);
        expect(res).toBe(10);
    });
    test('getTransactionTax fn / fixed tax', () => {
        const tax = 40;
        const res = taxService.getTransactionTax(tax);
        expect(res).toBe(40);
    });
    test('transactionTax fn / default tax', () => {
        const tax = 0;
        const res = taxService.transactionTax(tax);
        expect(res).toBe(0.1);
    });
    test('transactionTax fn / fixed tax', () => {
        const tax = 40;
        const res = taxService.transactionTax(tax);
        expect(res).toBe(0.4);
    });
    test('transactionTaxSum fn / fixed tax', () => {
        const sum = 100
        const tax = 40;
        const res = taxService.transactionTaxSum(sum,tax);
        expect(res).toBe(40);
    });
        test('transactionTaxSum fn / default tax', () => {
            const sum = 100
            const tax = 0;
            const res = taxService.transactionTaxSum(sum,tax);
            expect(res).toBe(10);
    });
});