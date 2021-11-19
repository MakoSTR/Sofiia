const command = require("../resources/input_files/commandConfiguration.json");
const warehousesService = require("../servises/warehousesHandler");
const {createAuditMessage, disabler} = require("../helpers/helpers");
const kitchenHandler = require('../handlers/kitchenHandler');
const fileReader = require('../servises/fileReader');

const orderAction = (i, validBudget, filePathForOutput ) => {
    if (command[i[0].toLowerCase()] === 'ingredients') {
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
    }
    if (command[i[0].toLowerCase()] === 'dishes') {
        if (validBudget) {
            let ingredient = i[1];
            let number = i[2];
            const isDish = warehousesService.checkIsDish(ingredient);
            let resMessage;
            if (isDish.length > 0) {
                const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max dish type"] );
                resMessage = !orderData.res ?
                    `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max dish type"]})` :
                    `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                const auditMessage = createAuditMessage(i, resMessage);
                kitchenHandler.auditAction(auditMessage);
                fileReader.appendFile(filePathForOutput, auditMessage);
            } else {
                const error = 'You cannot order something which is NOT a dish';
                const message = createAuditMessage(i, error)
                fileReader.appendFile(filePathForOutput, message);
                kitchenHandler.auditAction(message);
            }
        } else {
            kitchenHandler.sendRestaurantBudget();
        }
        console.log('dishes')
    }
    if (command[i[0].toLowerCase()] === 'all') {
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
            } else
            if (isDish.length > 0) {
                const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max dish type"] );
                resMessage = !orderData.res ?
                    `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max dish type"]})` :
                    `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                const auditMessage = createAuditMessage(i, resMessage);
                kitchenHandler.auditAction(auditMessage);
                fileReader.appendFile(filePathForOutput, auditMessage);
            }
        } else {
            kitchenHandler.sendRestaurantBudget();
        }
        console.log('all')
    }
    else {
        disabler(i)
    }
}

module.exports = { orderAction };