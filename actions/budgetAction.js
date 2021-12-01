const command = require("../resources/input_files/commandConfiguration.json");
const restaurantBudgetService = require("../servises/restaurantBudget");
const helpers = require("../helpers/helpers");
const kitchenHandler = require('../handlers/kitchenHandler');
const trashService = require("../servises/trashService");

const budgetAction = (i, trash, filePathForOutput) => {
    if (command[i[0].toLowerCase()] === 'yes') { //якщо команда дозволена
        trashService.checkIsPoisoned(trash, command["waste limit"]);
        if (!trashService.getPoisoned()) { //якщо ресторан не отруєно
            let sign = i[1];
            let amount = parseInt(i[2]);
            restaurantBudgetService.modifyRestaurantBudget(sign, amount)
            const budget = kitchenHandler.sendRestaurantBudget(command["daily tax"]);
            const resMessage = `Restaurant budget: ${budget}`;
            const message = helpers.createAuditMessage(i, resMessage);
            kitchenHandler.auditAction(message);
        }
        if (trashService.getPoisoned()) {  //якщо ресторан отруєно
            kitchenHandler.messagePoisoned(filePathForOutput);
        }
    }
    else {
    helpers.disabler(i) //якщо команда дозволена
    }
};

module.exports = { budgetAction };