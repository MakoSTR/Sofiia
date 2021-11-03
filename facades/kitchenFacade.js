const restaurantBudgetService = require("../servises/restaurantBudget");
const warehousesService = require("../servises/warehousesHandler");
const audit = require("../servises/audit");
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

    order = (ingredient, number) => {
        const warehouses = warehousesService.getWarehouses();
        restaurantBudgetService.addIngredients(warehouses, ingredient, number);
        restaurantBudgetService.decreaseRestaurantBudget(ingredient, number);
    };

    auditAction = (message) => {
        const warehouses = warehousesService.getWarehouses();
        const warehousesCopy = { ...warehouses };
        const restaurantBudget = restaurantBudgetService.getRestaurantBudget();
        audit.addToAudit({ res: message, budget: restaurantBudget, warehouses: warehousesCopy });
    };
}

module.exports = KitchenFacade;