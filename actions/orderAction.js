const helpers = require("../helpers/helpers");
const kitchenHandler = require('../handlers/kitchenHandler');
const trashService = require('../servises/trashService');
const orderService = require('../servises/orderService');
const fileReader = require("../servises/fileReader");

const orderForIngredients = (inputArrays, command, resMessage, filePathForOutput, i, trash) => {
    inputArrays.forEach((array) => {
        if (!trashService.getPoisoned()) {
            const userIngredients = [];
            let ingredient = array[0];
            let number = array[1];
            const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max ingredient type"], userIngredients );
            resMessage = !orderData.res ?
                `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max ingredient type"]})` :
                `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
            const auditMessage = helpers.createAuditMessage(i, resMessage);
            orderData.wastedQuantity
                ? trashService.trashService(command["waste limit"], trash, orderData.wastedQuantity, ingredient)
                : console.log('nothing to add to trash');
            kitchenHandler.auditAction(auditMessage, trash);
            fileReader.appendFile(filePathForOutput, auditMessage);
        }
        if (trashService.getPoisoned()) {
            kitchenHandler.messagePoisoned(filePathForOutput);
        }
    });
};

const orderForDish = (inputArrays, command, resMessage, filePathForOutput, i, trash) => {
    inputArrays.forEach(array => {
            if (!trashService.getPoisoned()) {
                const userIngredients = [];
                let ingredient = array[0];
                let number = array[1];
                const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max dish type"], userIngredients );
                resMessage = !orderData.res ?
                    `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max dish type"]})` :
                    `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                //trash
                if (orderData.wastedQuantity) {
                    userIngredients.forEach(everyIngredient => {
                        trashService.trashService(command["waste limit"], trash, orderData.wastedQuantity, everyIngredient)
                    })
                }
                const auditMessage = helpers.createAuditMessage(i, resMessage);
                kitchenHandler.auditAction(auditMessage, trash);
                fileReader.appendFile(filePathForOutput, auditMessage);
            }
            if (trashService.getPoisoned()) {
                kitchenHandler.messagePoisoned(filePathForOutput);
            }
        }
    );
};

const orderAction = (i, validBudget, filePathForOutput, command, food, base, trash) => {
    const inputArrays = orderService.dividedArray(i);
    const checkIsMalformedRec = orderService.checkIsMalformedRecord(i);
    trashService.checkIsPoisoned(trash, command["waste limit"]);
    const isDish = orderService.checkIsDishForAll(i);

    if (!checkIsMalformedRec.length) { //якщо немає невалідних записів
        if(validBudget && !trashService.getPoisoned()) { //якщо ресторан не банкрут і не отруєний
            if (command[i[0].toLowerCase()] === 'ingredients') { //якщо в файлі позиція 'ingredients'
                let resMessage;
                if (!isDish.length) { //якщо всі ордери - базові інградієнти
                    orderForIngredients(inputArrays, command, resMessage, filePathForOutput, i, trash);
                } else {
                    const error = 'You cannot order something which is NOT a basic ingredient';
                    console.log('error from ingredient: ', error);
                }
            }
            if (command[i[0].toLowerCase()] === 'dishes') {
                if (isDish.length === inputArrays.length) { //якщо всі ордери це dish
                    let resMessage;
                    orderForDish(inputArrays, command, resMessage, filePathForOutput, i, trash);
                }
                else {
                    const error = 'You cannot order something which is NOT a dish';
                    console.log('error from dish: ', error);
                }
            }
            if (command[i[0].toLowerCase()] === 'all') {
                const isIngredient = orderService.checkIsIngredientForAll(i);
                if (isIngredient.length > 0) { //для ордерів інградієнтів
                    let resMessage;
                    orderForIngredients(isIngredient, command, resMessage, filePathForOutput, i, trash);
                }
                if (isDish.length > 0) { //для ордерів страв
                    let resMessage;
                    orderForDish(isDish, command, resMessage, filePathForOutput, i, trash);
                }
            }
            else helpers.disabler(i) //якщо команда недоступна чи відсутня в конфіг
        }
        else if (trashService.getPoisoned()) { //якщо ресторан poisoned
            kitchenHandler.messagePoisoned(filePathForOutput);
        } else
            kitchenHandler.sendRestaurantBudget(); //якщо ресторан банкрот
    }
    else if (checkIsMalformedRec.length > 0) { //якщо є брак інформації
        console.log('skip malformed record: parameters are missing');
    }
};

module.exports = { orderAction };