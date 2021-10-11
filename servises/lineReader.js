const readline = require('readline');
const { result } = require("./orderHandler");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Write who buys what', (answer) => {
    // TODO: Log the answer in a database
    let input = answer.split(', ');
    let person = input[0];
    let order = input[1]
    result(person, order); //person, order,

    rl.close();
});

