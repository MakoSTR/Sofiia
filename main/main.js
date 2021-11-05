const readline = require('readline');
const orderHandler = require("../servises/orderHandler");
const FileReader = require('../servises/fileReader');
const restaurantBudgetService = require("../servises/restaurantBudget");
const warehousesService = require('../servises/warehousesHandler');
const jsonData = require("../resources/input_files/data.json");
const audit = require('../servises/audit');
const taxService = require('../servises/taxService');
const { createAuditMessage, disabler } = require("../helpers/helpers");
const command = require('../resources/input_files/commandConfiguration.json');
const messageCodes = require('../resources/messageCodes.json');

const KitchenFacade = require("../facades/kitchenFacade");
const kitchenFacade = new KitchenFacade();
const fileReader = new FileReader();

const filePathForOutput = './resources/output_files/output.txt';
const filePathFotInput = './resources/input_files/';
const customers = Object.keys(jsonData['Regular customer']);
const dishes = Object.keys(jsonData.Food);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt("Write file name");
rl.prompt();

rl.on('line',  function(answer) {
    kitchenFacade.sendRestaurantBudget(command["daily tax"]);
    const input = fileReader.readFile(filePathFotInput, answer);
    const dataArray = input.split('\r\n');

    const initialBudget = restaurantBudgetService.getRestaurantBudget();
    const initialWarehouses = { ...warehousesService.getWarehouses() };
    const initialDailyTax = taxService.getAlreadyCollectedTax();
    audit.addToAudit({ initialBudget, initialWarehouses, initialDailyTax });

    const newArr = dataArray.map(e => e.split(', '));

    for (const i of newArr) {
        if (i.length >= 3 || i[0] === 'Audit') {
            const validBudget = kitchenFacade.checkRestaurantBudget();

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
                                kitchenFacade.auditAction(message);
                            }
                            else {
                                const error = `ERROR. Lack of ingredients`;
                                const message = createAuditMessage(i, error);
                                fileReader.appendFile (filePathForOutput, message);
                                kitchenFacade.auditAction(message);
                            }
                        } else {
                            kitchenFacade.sendRestaurantBudget();
                            // add to audit?
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
                                const transactionTax = kitchenFacade.order(ingredient, number, command["transaction tax"])
                                const message = createAuditMessage(i, `success; tax = ${transactionTax}`);
                                kitchenFacade.auditAction(message);
                            } else {
                                const error = 'You cannot order something which is NOT a basic ingredient';
                                const message = createAuditMessage(i, error)
                                fileReader.appendFile(filePathForOutput, message);
                                kitchenFacade.auditAction(message);
                            }
                        } else {
                            kitchenFacade.sendRestaurantBudget();
                            /// add to audit?
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
                        const budget = kitchenFacade.sendRestaurantBudget(command["daily tax"]);
                        const resMessage = `Restaurant budget: ${budget}`;
                        const message = createAuditMessage(i, resMessage);
                        kitchenFacade.auditAction(message);
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
                                kitchenFacade.auditAction(message);
                            } else
                            if (findCustomers.length > findDishes.length) {
                                const resMessage = 'ERROR. Every person needs something to eat. So, whole table fails.';
                                const message = createAuditMessage(i, resMessage);
                                fileReader.appendFile(filePathForOutput, message)
                                kitchenFacade.auditAction(message);
                            } else
                            if (findSameCustomerNames) {
                                const resMessage = 'ERROR. One person can appear only once at the table. So, whole table fails.';
                                const message = createAuditMessage(i, resMessage);
                                fileReader.appendFile(filePathForOutput, message)
                                kitchenFacade.auditAction(message);
                            } else
                            if (checkIngredientsForAllDishes) {
                                const tableResult = orderHandler.table(findCustomers, findDishes, command["profit margin"]);
                                let resMessage = tableResult.message;
                                if (tableResult.message === messageCodes.success) {
                                    resMessage = `${tableResult.message}, sum: ${tableResult.totalSum}, tax: ${tableResult.totalTax}`
                                }
                                const message = createAuditMessage(i, resMessage);
                                kitchenFacade.auditAction(message);
                            } else {
                                const error = `ERROR. Lack of ingredients`;
                                const message = createAuditMessage(i, error);
                                fileReader.appendFile(filePathForOutput, message);
                                kitchenFacade.auditAction(message)
                            }
                        } else {
                            kitchenFacade.sendRestaurantBudget();
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
            // const clientBudget = orderHandler.result(person, order);
            // if (clientBudget >= 0) {
            //     rl.prompt();
            // } else {
            //     rl.close()
            // }
    //     }
    }
    // )
    const validBudget = kitchenFacade.checkRestaurantBudget();
    kitchenFacade.sendRestaurantBudget();
    fileReader.appendFile(filePathForOutput, `Daily tax: ${taxService.dailyTaxSum(command["daily tax"], validBudget, 500)}`);


    // const clientBudget = orderHandler.result(person, order); //person, order

    // if (clientBudget >= 0) {
    //     rl.prompt();
    // } else {
    //     rl.close()
    // }

}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});