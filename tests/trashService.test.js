const trashService = require('../servises/trashService');

describe('trashService', () => {
    test('getWasteLimit: waste limit = 10 => return 10', () => {
        const wasteLimit = 10;
        const getWasteLimit = trashService.getWasteLimit(wasteLimit);
        expect(getWasteLimit).toBe(10);
    });
    test('getWasteLimit: waste limit = undefined => return 50 (default)', () => {
        const wasteLimit = undefined;
        const getWasteLimit = trashService.getWasteLimit(wasteLimit);
        expect(getWasteLimit).toBe(50);
    });
    test('getValues: expect to receive array with 14 & 1', () => {
        const trash = {'Tuna': 14, 'Potatoes': 1}
        const res = trashService.getValues(trash);
        expect(res.length).toBe(2);
        expect(res[0]).toBe(14);
        expect(res[1]).toBe(1);
    });
    test('getTotalSumFromTrash: should receive sum of trash (two ingredients)', () => {
        const trash = {'Tuna': 14, 'Potatoes': 1};
        const res = trashService.getTotalSumFromTrash(trash);
        expect(res).toBe(15);
    });
    test('getTotalSumFromTrash: should receive sum of trash (one ingredient)', () => {
        const trash = {'Potatoes': 1};
        const res = trashService.getTotalSumFromTrash(trash);
        expect(res).toBe(1);
    });
    test('checkFreeSpaceOfTrash: should return true when it is free space', () => {
        const wasteLimit = 20;
        const trash = {'Potatoes': 1};
        const wastedQuantity = 5
        const res = trashService.checkFreeSpaceOfTrash(wasteLimit, trash, wastedQuantity);
        expect(res).toBe(true);
    });
    test('checkFreeSpaceOfTrash: should return false when it is no free space', () => {
        const wasteLimit = 20;
        const trash = {'Potatoes': 19};
        const wastedQuantity = 5
        const res = trashService.checkFreeSpaceOfTrash(wasteLimit, trash, wastedQuantity);
        expect(res).toBe(false);
    });
    test('checkIsPoisoned: should return false when it is a free space', () => {
        const wasteLimit = 20;
        const trash = {'Potatoes': 19};
        const res = trashService.checkIsPoisoned(trash, wasteLimit);
        expect(res).toBe(false);
    });
    test('checkIsPoisoned: should return true when it is no free space', () => {
        const wasteLimit = 20;
        const trash = {'Potatoes': 29};
        const res = trashService.checkIsPoisoned(trash, wasteLimit);
        expect(res).toBe(true);
    });
});