const readline = require('readline');
const orderHandler = require("./orderHandler");
const FileReader = require('./fileReader');
const restaurantBudgetService = require("./restaurantBudget");
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
                        orderHandler.buy(person, order)
                    } else {
                        sendRestaurantBudget();
                    }
                    break;
                case 'Order' :
                    if (validBudget) {
                        let ingredient = i[1];
                        let number = i[2];
                        restaurantBudgetService.decreaseRestaurantBudget(ingredient, number);
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
                        let person1 = i[1];
                        let order1 = i[3];
                        let person2 = i[2];
                        let order2 = i[4];

                        const findCustomers = customers.filter(customer => customer === i[1] || customer === i[2] || customer === i[3] || customer === i[4]);
                        const findDishes = dishes.filter(dish => dish === i[1] || dish === i[2] || dish === i[3] || dish === i[4]);

                        if (findCustomers.length === 1 && findDishes.length === 1) {
                            orderHandler.buy(findCustomers, findDishes)
                        } else
                        if (findCustomers.length === 1 && findDishes.length === 2) {
                            fileReader.appendFile('ERROR. One person can have one type of food only. So, whole table fails.')
                        } else
                        if (findCustomers.length === 2 && findDishes.length === 1) {
                            fileReader.appendFile('ERROR. Every person needs something to eat. So, whole table fails.')
                        } else
                        if (person1 === person2) {
                            fileReader.appendFile('ERROR. One person can appear only once at the table. So, whole table fails.')
                        } else {
                            orderHandler.table(person1, order1, person2, order2);
                        }
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
}

