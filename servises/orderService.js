const taxService = require("./taxService");
const priceData = require("../resources/input_files/price.json");
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
}

const orderService = new OrderService();

module.exports = orderService;