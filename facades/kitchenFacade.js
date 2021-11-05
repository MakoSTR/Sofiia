const restaurantBudgetService = require("../servises/restaurantBudget");
const warehousesService = require("../servises/warehousesHandler");
const audit = require("../servises/audit");
const taxService = require('../servises/taxService');
const FileReader = require("../servises/fileReader");

const fileReader = new FileReader();
const filePathForOutput = './resources/output_files/output.txt';

class KitchenFacade {
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

    order = (ingredient, number, tax) => {
        const warehouses = warehousesService.getWarehouses();
        restaurantBudgetService.addIngredients(warehouses, ingredient, number);
        return restaurantBudgetService.decreaseRestaurantBudget(ingredient, number, tax);

    };

    auditAction = (message) => {
        const warehouses = warehousesService.getWarehouses();
        const warehousesCopy = { ...warehouses };
        const restaurantBudget = restaurantBudgetService.getRestaurantBudget();
        const transactionTax = taxService.getAlreadyCollectedTax()
        audit.addToAudit({ res: message, budget: restaurantBudget, warehouses: warehousesCopy, transactionTax });
    };
}

module.exports = KitchenFacade;