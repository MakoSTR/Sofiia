const readline = require('readline');
const { OrderHandler } = require("./orderHandler");
const { FileReader } = require('./fileReader');

const orderHandler = new OrderHandler();
const fileReader = new FileReader();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt("Write file name");
rl.prompt();

rl.on('line', async function(answer) {
    const input = fileReader.readFile(answer);
    const dataArray = input.split('\r\n');

    await sendRestaurantBudget();

    const newArr = dataArray.map(e => e.split(', '));
    newArr.forEach(i => {
        if (i.length === 3) {
            let action = i[0];
            switch (action) {
                case 'Buy' :
                    let person = i[1];
                    let order = i[2];

                    orderHandler.result(person, order)
                    break;
                case 'Order' :
                    console.log('Order')
                    break;
                case 'Budget' :
                    let sign = i[1];
                    let amount = parseInt(i[2]);
                    orderHandler.modifyRestaurantBudget(sign, amount)
                    sendRestaurantBudget();
                    break;
                case 'Table' :
                    console.log('Table')
                    break;
                default:
                    console.log('default');
            }

            // const clientBudget = orderHandler.result(person, order);
            // if (clientBudget >= 0) {
            //     rl.prompt();
            // } else {
            //     rl.close()
            // }
        }
    })
    await sendRestaurantBudget();

    // let person = dataArray[1];
    // let order = dataArray[2];
    // console.log('input', input);
    // console.log('dataArray', dataArray);
    // console.log('dataArray0', dataArray0);
    // console.log('dataArray1', dataArray1);

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

const sendRestaurantBudget = async () => {
    const restaurantBudget = orderHandler.getRestaurantBudget();
    if (restaurantBudget > 0) {
        const modifiedRestaurantBudget = `Restaurant budget: ${restaurantBudget}`;
        await fileReader.appendFile(modifiedRestaurantBudget);
    } else await  fileReader.appendFile(`RESTAURANT BANKRUPT`);
}