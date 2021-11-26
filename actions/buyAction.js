const command = require("../resources/input_files/commandConfiguration.json");
const warehousesService = require("../servises/warehousesHandler");
const buyService = require("../servises/buyService");
const helpers = require("../helpers/helpers");
const kitchenHandler = require('../handlers/kitchenHandler');
const fileReader = require('../servises/fileReader');
const trashService = require("../servises/trashService");

const buyAction = (i, validBudget, filePathForOutput, dishes, trash) => {
    if (command[i[0].toLowerCase()] === 'yes') {
        trashService.checkIsPoisoned(trash, command["waste limit"]);
        let person = i[1];
        let order = i[2];
        const malformedFood = kitchenHandler.isMalformedFood(order, dishes);
        if (!malformedFood) {
            if (validBudget && !trashService.getPoisoned()) {
                const localMax = kitchenHandler.findLocalMax(order, command);
                const warehouses = warehousesService.getWarehouses();
                const warehousesCopy = { ...warehouses };
                const warehouseCheckResult = warehousesService.checkDishIngredientsInWarehouse(order, warehousesCopy);
                if (warehouses[order] > 0 || !warehouseCheckResult) {
                    const res = buyService.buy(person, order, command["profit margin"], command["dishes with allergies"], command["total maximum"], localMax, trash);
                    const message = helpers.createAuditMessage(i, res.sendRes);
                    kitchenHandler.auditAction(message);
                }
                else {
                    const error = `ERROR. Lack of ingredients`;
                    const message = helpers.createAuditMessage(i, error);
                    fileReader.appendFile (filePathForOutput, message);
                    kitchenHandler.auditAction(message);
                }
            } else
            if (trashService.getPoisoned()) {
                kitchenHandler.messagePoisoned(filePathForOutput)
            } else {
                kitchenHandler.sendRestaurantBudget();
            }
        } else {
            const error = `${person} can’t buy ${order}, cook has no idea how to make it`;
            const message = helpers.createAuditMessage(i, error);
            fileReader.appendFile (filePathForOutput, message);
            kitchenHandler.auditAction(message);
        }
    } else {
        helpers.disabler(i)
    }
};

module.exports = { buyAction };