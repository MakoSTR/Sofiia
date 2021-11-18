const command = require("../resources/input_files/commandConfiguration.json");
const warehousesService = require("../servises/warehousesHandler");
const {createAuditMessage, disabler} = require("../helpers/helpers");
const buyService = require("../servises/buyService");
const messageCodes = require("../resources/messageCodes.json");
const KitchenHandler = require('../handlers/kitchenHandler');
const FileReader = require('../servises/fileReader');

const kitchenHandler = new KitchenHandler;
const fileReader = new FileReader;

const tableAction = (i, validBudget, customers, dishes, filePathForOutput) => {
    if (command[i[0].toLowerCase()] === 'yes') {
        if (validBudget) {
            const findCustomers = i.filter(i => {
                return customers.some(customer => i === customer);
            })
            const findDishes = i.filter(i => {
                return dishes.some(dish => i === dish);
            });
            const findSameCustomerNames = customers.some(customer => {
                const sameNames = findCustomers.filter(inputCustomer => customer === inputCustomer);
                return sameNames.length > 1;
            });

            const warehouses = warehousesService.getWarehouses();
            const checkIngredientsForAllDishes = findDishes.every(dish => {
                const warehousesCopy = { ...warehouses };
                const warehouseResult = warehousesService.checkDishIngredientsInWarehouse(dish, warehousesCopy);

                return warehouses[dish] > 0 || warehouseResult === false;
            })

            if (findCustomers.length < findDishes.length) {
                const resMessage = 'ERROR. One person can have one type of food only. So, whole table fails.';
                const message = createAuditMessage(i, resMessage);
                fileReader.appendFile(filePathForOutput, message);
                kitchenHandler.auditAction(message);
            } else
            if (findCustomers.length > findDishes.length) {
                const resMessage = 'ERROR. Every person needs something to eat. So, whole table fails.';
                const message = createAuditMessage(i, resMessage);
                fileReader.appendFile(filePathForOutput, message)
                kitchenHandler.auditAction(message);
            } else
            if (findSameCustomerNames) {
                const resMessage = 'ERROR. One person can appear only once at the table. So, whole table fails.';
                const message = createAuditMessage(i, resMessage);
                fileReader.appendFile(filePathForOutput, message)
                kitchenHandler.auditAction(message);
            } else
            if (checkIngredientsForAllDishes) {
                const tableResult = buyService.table(findCustomers, findDishes, command["profit margin"]);
                let resMessage = tableResult.message;
                if (tableResult.message === messageCodes.success) {
                    resMessage = `${tableResult.message}, sum: ${tableResult.totalSum}, tax: ${tableResult.totalTax}`
                }
                const message = createAuditMessage(i, resMessage);
                kitchenHandler.auditAction(message);
            } else {
                const error = `ERROR. Lack of ingredients`;
                const message = createAuditMessage(i, error);
                fileReader.appendFile(filePathForOutput, message);
                kitchenHandler.auditAction(message)
            }
        } else {
            kitchenHandler.sendRestaurantBudget();
        }
    } else {
        disabler(i)
    }
};

module.exports = { tableAction };
