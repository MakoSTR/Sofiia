const helpers = require("../helpers/helpers");
const kitchenHandler = require("../handlers/kitchenHandler");
const jsonData = require("../resources/input_files/data.json");
const command = require("../resources/input_files/commandConfiguration.json");
const orderAction = require('../actions/orderAction');
const budgetAction = require('../actions/budgetAction');
const tableAction = require('../actions/tableAction');
const buyAction = require('../actions/buyAction');
const auditAction = require('../actions/auditAction');
const throwTrashAwayAction = require('../actions/throwTrashAwayAction');
const trashService = require('../servises/trashService');

const filePathForOutput = './resources/output_files/output.txt';
// const wastePool = require('../resources/output_files/wastePool.json');
const customers = Object.keys(jsonData['Regular customer']);
const dishes = Object.keys(jsonData.Food);
const baseIngredient = jsonData["Base ingredients"];
const trash = trashService.getTrash();
const wastePool = trashService.getWastePool();

const main = (newArr) => {
    for (const i of newArr) {
        if (i.length >= 3 || i[0] === 'Audit' || i[0] === 'Throw trash away') {
            const validBudget = kitchenHandler.checkRestaurantBudget();

            let action = i[0];
            switch (action) {
                case 'Buy' :
                    buyAction.buyAction(i, validBudget, filePathForOutput, dishes, trash)
                    break;
                case 'Order' :
                    orderAction.orderAction(i, validBudget, filePathForOutput, command, dishes, baseIngredient, trash)
                    break;
                case 'Budget' :
                    budgetAction.budgetAction(i, trash, filePathForOutput)
                    break;
                case 'Table' :
                    tableAction.tableAction(i, validBudget, customers, dishes, filePathForOutput, trash)
                    break;
                case 'Audit' :
                    auditAction.auditAction(i)
                    break;
                case 'Throw trash away' :
                    throwTrashAwayAction.throwTrashAwayAction(trash, wastePool, i, filePathForOutput)
                    console.log('Throw trash away');
                    break
                default:
                    helpers.disabler(i)
            }
        }
    }
};

module.exports = { main }