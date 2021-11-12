const restaurantBudgetService = require("../servises/restaurantBudget");
const warehousesService = require("../servises/warehousesHandler");
const audit = require("../servises/audit");
const taxService = require('../servises/taxService');
const FileReader = require("../servises/fileReader");

const fileReader = new FileReader();
const filePathForOutput = './resources/output_files/output.txt';

class KitchenHandler {
    sendRestaurantBudget = () => {
        const validBudget = this.checkRestaurantBudget();
        if (validBudget) {
            const modifiedRestaurantBudget = `Restaurant budget: ${validBudget}`;
            fileReader.appendFile(filePathForOutput, modifiedRestaurantBudget);
        } else {
            fileReader.appendFile(filePathForOutput, `RESTAURANT BANKRUPT`);
        }

        return validBudget > 0 ? validBudget : `RESTAURANT BANKRUPT`;
    };

    checkRestaurantBudget = () => {
        const restaurantBudget = restaurantBudgetService.getRestaurantBudget();
        if (restaurantBudget > 0) {
            return restaurantBudget;
        }
        return false;
    };

    order = (ingredient, number, tax, totalMax, maxLimit) => {
        const warehouses = warehousesService.getWarehouses();
        const transactionResult = restaurantBudgetService.decreaseRestaurantBudget(ingredient, number, tax);
        const warehouseResult = warehousesService.checkWarehouseSpace(warehouses, number, totalMax, ingredient, maxLimit);
        if (warehouseResult.res) {
            warehousesService.addIngredients(warehouses, ingredient, number);
        } else if (warehouseResult.freeSpace) {
            warehousesService.addIngredients(warehouses, ingredient, warehouseResult.freeSpace);
        }
        return {...transactionResult, ...warehouseResult};
    };

    auditAction = (message) => {
        const warehouses = warehousesService.getWarehouses();
        const warehousesCopy = { ...warehouses };
        const restaurantBudget = restaurantBudgetService.getRestaurantBudget();
        const transactionTax = taxService.getAlreadyCollectedTax()
        audit.addToAudit({ res: message, budget: restaurantBudget, warehouses: warehousesCopy, transactionTax });
    };
}

module.exports = KitchenHandler;