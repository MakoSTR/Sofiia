const taxService = require("./taxService");
const priceData = require("../resources/input_files/price.json");
const warehousesService = require("../servises/warehousesHandler");
const price = priceData['Base ingredients'];

class OrderService {
    sumForKeepedOrder = (ingredients, margin, transactionTax) => {
        const sumArray = [];
        ingredients.forEach(i => sumArray.push(price[i]));
        const orderAmount = Math.ceil(sumArray.reduce((total, amount) => total + amount))
        const transactionTaxSum = taxService.transactionTaxSum(orderAmount, transactionTax);
        const orderSum = orderAmount + transactionTaxSum;
        taxService.addAlreadyCollectedTax(orderAmount, transactionTax);
        const extraSum = orderSum * 0.25;
        return { orderSum, extraSum };
    }
    dividedArray = i => {
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
        return result;
    }
    checkIsMalformedRecord = (i) => {
        const inputArray = this.dividedArray(i);
        const malformedRecord = inputArray.find(array => array.length !== 2);
        return malformedRecord ? malformedRecord : []
    };
    checkIsDishForAll = i => {
        const inputArray = this.dividedArray(i);
        const isDish = inputArray.filter(array => {
            const checkIsDish = warehousesService.checkIsDish(array[0]);
            return checkIsDish.length !== 0;
        });
        return isDish ? isDish : [];
    };
    checkIsIngredientForAll = i => {
        const inputArray = this.dividedArray(i);
        const isIngredient = inputArray.filter(array => {
            const checkIsDish = warehousesService.checkIsDish(array[0]);
            return checkIsDish.length === 0;
        });
        return isIngredient ? isIngredient : [];
    };
}

const orderService = new OrderService();

module.exports = orderService;