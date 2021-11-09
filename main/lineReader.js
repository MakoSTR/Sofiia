const readline = require('readline');
const FileReader = require('../servises/fileReader');
const restaurantBudgetService = require("../servises/restaurantBudget");
const warehousesService = require('../servises/warehousesHandler');
const audit = require('../servises/audit');
const taxService = require('../servises/taxService');
const command = require('../resources/input_files/commandConfiguration.json');
const KitchenFacade = require("../handlers/kitchenHandler");
const { main } = require('./main');

const kitchenFacade = new KitchenFacade();
const fileReader = new FileReader();

const filePathForOutput = './resources/output_files/output.txt';
const filePathFotInput = './resources/input_files/';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lineReader = () => {
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

        main(newArr); //main switcher

        const validBudget = kitchenFacade.checkRestaurantBudget();
        kitchenFacade.sendRestaurantBudget();
        fileReader.appendFile(filePathForOutput, `Daily tax: ${taxService.dailyTaxSum(command["daily tax"], validBudget, 500)}`);

    }).on('close', function() {
        console.log('Have a great day!');
        process.exit(0);
    });
}
lineReader();

module.exports = { lineReader };