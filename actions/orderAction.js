const warehousesService = require("../servises/warehousesHandler");
const helpers = require("../helpers/helpers");
const kitchenHandler = require('../handlers/kitchenHandler');
const fileReader = require('../servises/fileReader');

const dividedArray = (i) => {
    const perChunk = 2; // items per chunk
    const inputArray = i.slice(1);
    const result = inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index/perChunk)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, []);
    console.log('dividedArray', result);
    return result;
}

const checkIsMalformedRecord = (i) => {
    const inputArray = dividedArray(i);
    const malformedRecord = inputArray.find(array => array.length !== 2);

    console.log('malformedRecord', malformedRecord);
    return malformedRecord ? malformedRecord : []
};

const checkIsDishForAll = i => {
    const inputArray = dividedArray(i);
    const isDish = inputArray.filter(array => {
        const checkIsDish = warehousesService.checkIsDish(array[0]);
        return checkIsDish.length !== 0;
    });
    console.log('isDish', isDish);
    return isDish ? isDish : [];
};

const checkIsIngredientForAll = i => {
    const inputArray = dividedArray(i);
    const isIngredient = inputArray.filter(array => {
        const checkIsDish = warehousesService.checkIsDish(array[0]);
        return checkIsDish.length === 0;
    });
    console.log('isIngredient', isIngredient);
    return isIngredient ? isIngredient : [];
};

const orderAction = (i, validBudget, filePathForOutput, command) => {
    const inputArrays = dividedArray(i);
    const checkIsMalformedRec = checkIsMalformedRecord(i);
    if (!checkIsMalformedRec.length) { //якщо немає невалідних записів
        const isDish = checkIsDishForAll(i);
        if (command[i[0].toLowerCase()] === 'ingredients') { //якщо в файлі позиція 'ingredients'
            if (validBudget) { //якщо ресторант не банкрут
                let resMessage;
                if (!isDish.length) { //якщо всі ордери - базові інградієнти
                    inputArrays.forEach((array) => { //для кожного виконати наступне...
                        let ingredient = array[0];
                        let number = array[1];
                        const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max ingredient type"] );
                        resMessage = !orderData.res ?
                            `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max ingredient type"]})` :
                            `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                        const auditMessage = helpers.createAuditMessage(i, resMessage);
                        kitchenHandler.auditAction(auditMessage);
                        fileReader.appendFile(filePathForOutput, auditMessage);
                    });
                } else {
                    const error = 'You cannot order something which is NOT a basic ingredient';
                    console.log('error from ingredient: ', error);
                }
            } else {
                kitchenHandler.sendRestaurantBudget(); //якщо ресторан банкрот
            }
        } else
        if (command[i[0].toLowerCase()] === 'dishes') {
            if (validBudget) {
                if (isDish.length === inputArrays.length) { //якщо всі ордери це dish
                    inputArrays.forEach(array => {
                        let ingredient = array[0];
                        let number = array[1];
                        const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max dish type"] );
                        resMessage = !orderData.res ?
                            `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max dish type"]})` :
                            `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                        const auditMessage = helpers.createAuditMessage(i, resMessage);
                        kitchenHandler.auditAction(auditMessage);
                        fileReader.appendFile(filePathForOutput, auditMessage);
                    });
                }
                else {
                    const error = 'You cannot order something which is NOT a dish';
                    console.log('error from dish: ', error);
                }
            } else {
                kitchenHandler.sendRestaurantBudget();
            }
        } else
        if (command[i[0].toLowerCase()] === 'all') {
            const isIngredient = checkIsIngredientForAll(i)
            if (validBudget) {
                let resMessage;
                if (isIngredient.length > 0) {
                    isIngredient.forEach(array => {
                        let ingredient = array[0];
                        let number = array[1];
                        const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max ingredient type"] );
                        resMessage = !orderData.res ?
                            `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max ingredient type"]})` :
                            `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                        const auditMessage = helpers.createAuditMessage(i, resMessage);
                        kitchenHandler.auditAction(auditMessage);
                        fileReader.appendFile(filePathForOutput, auditMessage);
                    });
                }
                if (isDish.length > 0) {
                    isDish.forEach(array => {
                        let ingredient = array[0];
                        let number = array[1];
                        const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"], command["total maximum"], command["max dish type"] );
                        resMessage = !orderData.res ?
                            `Wasted: ${orderData.wastedQuantity} ${ingredient} (limit: ${command["max dish type"]})` :
                            `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`;
                        const auditMessage = helpers.createAuditMessage(i, resMessage);
                        kitchenHandler.auditAction(auditMessage);
                        fileReader.appendFile(filePathForOutput, auditMessage);
                    });
                }
            } else {
                kitchenHandler.sendRestaurantBudget();
            }
        }
    } else
    if (checkIsMalformedRecord.length > 0) {
        console.log('skip malformed record: parameters are missing');
    }
    else {
        helpers.disabler(i)
    }
};

module.exports = { orderAction, dividedArray, checkIsMalformedRecord, checkIsDishForAll, checkIsIngredientForAll };