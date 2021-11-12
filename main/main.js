const { disabler } = require("../helpers/helpers");
const KitchenHandler = require("../handlers/kitchenHandler");
const jsonData = require("../resources/input_files/data.json");
const { orderAction } = require('../actions/orderAction');
const { budgetAction } = require('../actions/budgetAction');
const { tableAction } = require('../actions/tableAction');
const { buyAction } = require('../actions/buyAction');
const { auditAction } = require('../actions/auditAction');

const kitchenHandler = new KitchenHandler();

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
                    buyAction(i, validBudget, filePathForOutput)
                    break;
                case 'Order' :
                    orderAction(i, validBudget, filePathForOutput)
                    break;
                case 'Budget' :
                    budgetAction(i)
                    break;
                case 'Table' :
                    tableAction(i, validBudget, customers, dishes, filePathForOutput)
                    break;
                case 'Audit' :
                    auditAction(i)
                    break;
                default:
                    disabler(i)
            }
        }
    }
};

module.exports = { main }