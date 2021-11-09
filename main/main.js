const command = require("../resources/input_files/commandConfiguration.json");
const warehousesService = require("../servises/warehousesHandler");
const orderHandler = require("../servises/orderHandler");
const { createAuditMessage, disabler } = require("../helpers/helpers");
const restaurantBudgetService = require("../servises/restaurantBudget");
const messageCodes = require("../resources/messageCodes.json");
const audit = require("../servises/audit");
const FileReader = require('../servises/fileReader');
const KitchenHandler = require("../handlers/kitchenHandler");
const jsonData = require("../resources/input_files/data.json");

const kitchenHandler = new KitchenHandler();
const fileReader = new FileReader();

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
                    if (command[i[0].toLowerCase()] === 'yes') {
                        if (validBudget) {
                            let person = i[1];
                            let order = i[2];
                            const warehouses = warehousesService.getWarehouses();
                            const warehousesCopy = { ...warehouses };
                            const warehouseCheckResult = warehousesService.checkDishIngredientsInWarehouse(order, warehousesCopy);
                            if (warehouses[order] > 0 || !warehouseCheckResult) {
                                const res = orderHandler.buy(person, order, command["profit margin"]);
                                const message = createAuditMessage(i, res.sendRes);
                                kitchenHandler.auditAction(message);
                            }
                            else {
                                const error = `ERROR. Lack of ingredients`;
                                const message = createAuditMessage(i, error);
                                fileReader.appendFile (filePathForOutput, message);
                                kitchenHandler.auditAction(message);
                            }
                        } else {
                            kitchenHandler.sendRestaurantBudget();
                        }
                    } else {
                        disabler(i)
                    }
                    break;
                case 'Order' :
                    if (command[i[0].toLowerCase()] === 'yes') {
                        if (validBudget) {
                            let ingredient = i[1];
                            let number = i[2];
                            const isDish = warehousesService.checkIsDish(ingredient);
                            if (isDish.length === 0) {
                                const orderData = kitchenHandler.order(ingredient, number, command["transaction tax"])
                                const message = createAuditMessage(i, `success; sum = ${orderData.orderAmount}; tax = ${orderData.transactionTaxSum}`);
                                kitchenHandler.auditAction(message);
                            } else {
                                const error = 'You cannot order something which is NOT a basic ingredient';
                                const message = createAuditMessage(i, error)
                                fileReader.appendFile(filePathForOutput, message);
                                kitchenHandler.auditAction(message);
                            }
                        } else {
                            kitchenHandler.sendRestaurantBudget();
                        }
                    } else {
                        disabler(i)
                    }
                    break;
                case 'Budget' :
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
                    break;
                case 'Table' :
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
                                const tableResult = orderHandler.table(findCustomers, findDishes, command["profit margin"]);
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
                    break;
                case 'Audit' :
                    if (command[i[0].toLowerCase()] === 'yes') {
                        audit.writeAudit(command["daily tax"]);
                    } else {
                        disabler(i)
                    }
                    break;
                default:
                    disabler(i)
                    console.log('default');
            }
        }
    }
};

module.exports = { main }