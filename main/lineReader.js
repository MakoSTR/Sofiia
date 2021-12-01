const readline = require('readline');
const fileReader = require('../servises/fileReader');
const restaurantBudgetService = require("../servises/restaurantBudget");
const warehousesService = require('../servises/warehousesHandler');
const audit = require('../servises/audit');
const taxService = require('../servises/taxService');
const command = require('../resources/input_files/commandConfiguration.json');
const kitchenHandler = require("../handlers/kitchenHandler");
const { main } = require('./main');
const filePathForOutput = './resources/output_files/output.txt';
const filePathFotInput = './resources/input_files/';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// запуск через консоль, вводимо назву файлу, з якого будемо зчитувати інфо
const lineReader = () => {
    rl.setPrompt("Write file name");
    rl.prompt();

    rl.on('line',  function(answer) {
        kitchenHandler.sendRestaurantBudget(command["daily tax"]);
        const input = fileReader.readFile(filePathFotInput, answer); //зчитуємо файл, назву якого ввели в консоль
        const dataArray = input.split('\r\n'); //ділимо еррей по ентеру (тобто кожний новий рядок стає окремим масивом)

        const initialBudget = restaurantBudgetService.getRestaurantBudget();
        const initialWarehouses = { ...warehousesService.getWarehouses() };
        const initialDailyTax = taxService.getAlreadyCollectedTax();
        audit.addToAudit({ initialBudget, initialWarehouses, initialDailyTax }); //додаємо інфо в аудит (початкові значення)

        const newArr = dataArray.map(e => e.split(', ')); //кожен масив, який ми по ентеру поділили (25 рядок) ділимо по комі+пробіл, отримуємо нові масиви

        main(newArr); //main switcher - головна ф-я, головний файл

        const validBudget = kitchenHandler.checkRestaurantBudget();
        kitchenHandler.sendRestaurantBudget();
        fileReader.appendFile(filePathForOutput, `Daily tax: ${taxService.dailyTaxSum(command["daily tax"], validBudget, 500)}`);

    }).on('close', function() {
        console.log('Have a great day!');
        process.exit(0);
    });
}
lineReader();

module.exports = { lineReader };