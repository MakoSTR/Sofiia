const helpers = require("../helpers/helpers");
const kitchenHandler = require("../handlers/kitchenHandler");
const jsonData = require("../resources/input_files/data.json");
const orderAction = require('../actions/orderAction');
const budgetAction = require('../actions/budgetAction');
const tableAction = require('../actions/tableAction');
const buyAction = require('../actions/buyAction');
const auditAction = require('../actions/auditAction');

const filePathForOutput = './resources/output_files/output.txt';
const customers = Object.keys(jsonData['Regular customer']);
const dishes = Object.keys(jsonData.Food);

const main = (newArr) => {
    for (const i of newArr) {
        if (i.length >= 3 || i[0] === 'Audit') {
            const validBudget = kitchenHandler.checkRestaurantBudget();

            let action = i[0];
            switch (action) {
                case 'Buy' :
                    buyAction.buyAction(i, validBudget, filePathForOutput)
                    break;
                case 'Order' :
                    orderAction.orderAction(i, validBudget, filePathForOutput)
                    break;
                case 'Budget' :
                    budgetAction.budgetAction(i)
                    break;
                case 'Table' :
                    tableAction.tableAction(i, validBudget, customers, dishes, filePathForOutput)
                    break;
                case 'Audit' :
                    auditAction.auditAction(i)
                    break;
                default:
                    helpers.disabler(i)
            }
        }
    }
};

module.exports = { main }