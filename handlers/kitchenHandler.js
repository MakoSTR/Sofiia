const restaurantBudgetService = require("../servises/restaurantBudget");
const warehousesService = require("../servises/warehousesHandler");
const audit = require("../servises/audit");
const taxService = require('../servises/taxService');
const fileReader = require("../servises/fileReader");
const trashService = require('../servises/trashService');

const filePathForOutput = './resources/output_files/output.txt';
// const trashObj = require('../resources/output_files/trash.json');

class KitchenHandler {
    isMalformedFood = (order, dishes) => {
        return dishes.every(dish => order !== dish);
    };

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

    order = (ingredient, number, tax, totalMax, maxLimit, userIngredients) => {
        const quantity = parseInt(number);
        const warehouses = warehousesService.getWarehouses();
        const transactionResult = restaurantBudgetService.decreaseRestaurantBudget(ingredient, quantity, tax, userIngredients);
        const warehouseResult = warehousesService.checkWarehouseSpace(warehouses, quantity, totalMax, ingredient, maxLimit);
        if (warehouseResult.res) {
            warehousesService.addIngredients(warehouses, ingredient, quantity);
        } else if (warehouseResult.freeSpace) {
            warehousesService.addIngredients(warehouses, ingredient, warehouseResult.freeSpace);
        }
        return {...transactionResult, ...warehouseResult};
    };

    auditAction = (message) => {
        const warehouses = warehousesService.getWarehouses();
        const warehousesCopy = { ...warehouses };
        const restaurantBudget = restaurantBudgetService.getRestaurantBudget();
        const transactionTax = taxService.getAlreadyCollectedTax();
        const trash = trashService.getTrash();
        const trashCopy = {...trash}

        audit.addToAudit({ res: message, budget: restaurantBudget, warehouses: warehousesCopy, transactionTax, trash: trashCopy });
    };

    findLocalMax = (order, command) => {
        let localMax;
        const dishArray = warehousesService.checkIsDish(order);
        dishArray.length === 0 ? localMax = command["max ingredient type"] : localMax = command["max dish type"];
        return localMax;
    };

    messagePoisoned = (filePathForOutput) => {
        const message = 'Restaurant Poisoned';
        fileReader.appendFile(filePathForOutput, message);
        kitchenHandler.auditAction(message);
    };
}

const kitchenHandler = new KitchenHandler();

module.exports = kitchenHandler;