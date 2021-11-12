const command = require("../resources/input_files/commandConfiguration.json");
const restaurantBudgetService = require("../servises/restaurantBudget");
const {createAuditMessage, disabler} = require("../helpers/helpers");
const KitchenHandler = require('../handlers/kitchenHandler');

const kitchenHandler = new KitchenHandler;

const budgetAction = (i) => {
    if (command[i[0].toLowerCase()] === 'yes') {
        let sign = i[1];
        let amount = parseInt(i[2]);
        restaurantBudgetService.modifyRestaurantBudget(sign, amount)
        const budget = kitchenHandler.sendRestaurantBudget(command["daily tax"]);
        const resMessage = `Restaurant budget: ${budget}`;
        const message = createAuditMessage(i, resMessage);
        kitchenHandler.auditAction(message);
    } else {
        disabler(i)
    }
};

module.exports = { budgetAction };