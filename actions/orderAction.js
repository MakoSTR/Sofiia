const command = require("../resources/input_files/commandConfiguration.json");
const warehousesService = require("../servises/warehousesHandler");
const {createAuditMessage, disabler} = require("../helpers/helpers");
const KitchenHandler = require('../handlers/kitchenHandler');
const FileReader = require('../servises/fileReader');

const kitchenHandler = new KitchenHandler;
const fileReader = new FileReader;


const orderAction = (i, validBudget, filePathForOutput ) => {
    if (command[i[0].toLowerCase()] === 'yes') {
        if (validBudget) {
            let ingredient = i[1];
            let number = i[2];
            const isDish = warehousesService.checkIsDish(ingredient);
            let resMessage;
            if (isDish.length === 0) {
                const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max ingredient type"] );
                resMessage = !orderData.res ?
                    `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max ingredient type"]})` :
                    `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                const auditMessage = createAuditMessage(i, resMessage);
                kitchenHandler.auditAction(auditMessage);
                fileReader.appendFile(filePathForOutput, auditMessage);
            } else {
                const error = 'You cannot order something which is NOT a basic ingredient';
                const message = createAuditMessage(i, error)
                fileReader.appendFile(filePathForOutput, message);
                kitchenHandler.auditAction(message);
            }
        } else {
            kitchenHandler.sendRestaurantBudget();
        }
    } else {
        disabler(i)
    }
}

module.exports = { orderAction };