const readline = require('readline');
const { result } = require("./orderHandler");
const budgetData = require('../recources/input_files/budget.json');
const budget = budgetData['Regular customer budget'];

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

// alt
// rl.setPrompt("Write who buys what");
// rl.prompt();
//
// rl.on('line', function(answer) {
//     // switch(line.trim()) {
//     //     case 'hello':
//     //         console.log('world!');
//     //         break;
//     //     default:
//     //         console.log('Say what? I might have heard `' + line.trim() + '`');
//     //         break;
//     // }
//     let input = answer.split(', ');
//     let person = input[0];
//     let order = input[1];
//     result(person, order); //person, order,
//
//     if (budget[person] >= 0) {
//         rl.prompt();
//     } else {
//         rl.close()
//     }
//
// }).on('close', function() {
//     console.log('Have a great day!');
//     process.exit(0);
// });

//Julie Mirage, Fries