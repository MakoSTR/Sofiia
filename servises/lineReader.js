const readline = require('readline');
const orderHandler = require("./orderHandler");
const FileReader = require('./fileReader');
const restaurantBudgetService = require("./restaurantBudget");
const warehousesService = require('../servises/warehousesHandler');
const jsonData = require("../resources/input_files/data.json");

const fileReader = new FileReader();

const customers = Object.keys(jsonData['Regular customer']);
const dishes = Object.keys(jsonData.Food);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt("Write file name");
rl.prompt();

rl.on('line',  function(answer) {
    const input = fileReader.readFile(answer);
    const dataArray = input.split('\r\n');

    sendRestaurantBudget();

    const newArr = dataArray.map(e => e.split(', '));

    for (const i of newArr) {
        if (i.length >= 3) {
            const validBudget = checkRestaurantBudget();

            let action = i[0];
            switch (action) {
                case 'Buy' :
                    if (validBudget) {
                        let person = i[1];
                        let order = i[2];
                        const warehouses = warehousesService.getWarehouses();
                        const warehousesCopy = { ...warehouses };
                        const warehouseCheckResult = warehousesService.checkDishIngredientsInWarehouse(order, warehousesCopy);
                        if (warehouses[order] > 0 || !warehouseCheckResult) {
                            orderHandler.buy(person, order)
                        }
                        else fileReader.appendFile (`ERROR. Lack of ingredients`)
                    } else {
                        sendRestaurantBudget();
                    }
                    break;
                case 'Order' :
                    if (validBudget) {
                        let ingredient = i[1];
                        let number = i[2];
                        const isDish = warehousesService.checkIsDish(ingredient);
                        if (isDish.length === 0) {
                            order(ingredient, number)
                        } else
                            fileReader.appendFile('You cannot order something which is NOT a basic ingredient');
                    } else {
                        sendRestaurantBudget();
                    }
                    break;
                case 'Budget' :
                    let sign = i[1];
                    let amount = parseInt(i[2]);
                    restaurantBudgetService.modifyRestaurantBudget(sign, amount)
                    sendRestaurantBudget();
                    break;
                case 'Table' :
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
                            fileReader.appendFile('ERROR. One person can have one type of food only. So, whole table fails.')
                        } else
                        if (findCustomers.length > findDishes.length) {
                            fileReader.appendFile('ERROR. Every person needs something to eat. So, whole table fails.')
                        } else
                        if (findSameCustomerNames) {
                            fileReader.appendFile('ERROR. One person can appear only once at the table. So, whole table fails.')
                        } else
                        if (checkIngredientsForAllDishes) {
                            orderHandler.table(findCustomers, findDishes);
                        } else fileReader.appendFile (`ERROR. Lack of ingredients`)
                    } else {
                        sendRestaurantBudget();
                    }
                    break;
                default:
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
    sendRestaurantBudget();

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

const sendRestaurantBudget = () => {
    const validBudget = checkRestaurantBudget();
    if (validBudget) {
        const modifiedRestaurantBudget = `Restaurant budget: ${validBudget}`;
        fileReader.appendFile(modifiedRestaurantBudget);
    } else {
        fileReader.appendFile(`RESTAURANT BANKRUPT`);
    }
};

const checkRestaurantBudget = () => {
    const restaurantBudget = restaurantBudgetService.getRestaurantBudget();
    if (restaurantBudget > 0) {
        return restaurantBudget;
    }
    return false;
};

const order = (ingredient, number) => {
    const warehouses = warehousesService.getWarehouses();
    restaurantBudgetService.addIngredients(warehouses, ingredient, number);
    restaurantBudgetService.decreaseRestaurantBudget(ingredient, number);
};
