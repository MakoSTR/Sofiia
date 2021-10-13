const readline = require('readline');
const { result } = require("./orderHandler");
const { getBudget } = require("./orderHandler");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//
// rl.question('Write who buys what', (answer) => {
//     // TODO: Log the answer in a database
//     let input = answer.split(', ');
//     let person = input[0];
//     let order = input[1]
//     result(person, order); //person, order,
//
//     rl.close();
// });

// alt
rl.setPrompt("Write who buys what");
rl.prompt();

rl.on('line', function(answer) {
    // switch(line.trim()) {
    //     case 'hello':
    //         console.log('world!');
    //         break;
    //     default:
    //         console.log('Say what? I might have heard `' + line.trim() + '`');
    //         break;
    // }
    let input = answer.split(', ');
    let person = input[0];
    let order = input[1];
    const clientBudget = result(person, order); //person, order

    if (clientBudget >= 0) {
        rl.prompt();
    } else {
        rl.close()
    }

}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});

//Julie Mirage, Fries