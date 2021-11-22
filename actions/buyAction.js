const command = require("../resources/input_files/commandConfiguration.json");
const warehousesService = require("../servises/warehousesHandler");
const buyService = require("../servises/buyService");
const helpers = require("../helpers/helpers");
const kitchenHandler = require('../handlers/kitchenHandler');
const fileReader = require('../servises/fileReader');

const buyAction = (i, validBudget, filePathForOutput) => {
    if (command[i[0].toLowerCase()] === 'yes') {
        if (validBudget) {
            let person = i[1];
            let order = i[2];
            const localMax = kitchenHandler.findLocalMax(order, command);
            const warehouses = warehousesService.getWarehouses();
            const warehousesCopy = { ...warehouses };
            const warehouseCheckResult = warehousesService.checkDishIngredientsInWarehouse(order, warehousesCopy);
            if (warehouses[order] > 0 || !warehouseCheckResult) {
                const res = buyService.buy(person, order, command["profit margin"], command["dishes with allergies"], command["total maximum"], localMax);
                const message = helpers.createAuditMessage(i, res.sendRes);
                kitchenHandler.auditAction(message);
            }
            else {
                const error = `ERROR. Lack of ingredients`;
                const message = helpers.createAuditMessage(i, error);
                fileReader.appendFile (filePathForOutput, message);
                kitchenHandler.auditAction(message);
            }
        } else {
            kitchenHandler.sendRestaurantBudget();
        }
    } else {
        helpers.disabler(i)
    }
};

module.exports = { buyAction };