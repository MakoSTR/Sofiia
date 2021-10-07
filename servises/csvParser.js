const csv = require('csv-parser');
const fs = require('fs');
const customers = [];

const getCustomersRes = (callback) => {
    fs.createReadStream('recources/input_files/customers.csv')
  .pipe(csv())
  .on('data', (data) => customers.push(data))
  .on('end', () => {

    const allergies = customers[0].Allergies;
    console.log('allergies', allergies)
    



    const person = customers[0]['Regular customer'];
    // console.log('customers',customers);
    // console.log('person',person);
    await callback(customers);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
};

const customersRes = getCustomersRes(() => {
    console.log('customers',customers);
})



// console.log('customers',customers);






/////////readline//

// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Write who buys what', (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`${answer} - res`);

//   rl.close();
// });



///////////////csvWriter//

// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const csvWriter = createCsvWriter({
//     path: 'recources/output_files/file.csv',
//     header: [
//         {id: 'name', title: 'NAME'},
//         {id: 'lang', title: 'LANGUAGE'}
//     ]
// });

// const records = [
//     {name: 'Bob',  lang: 'French, English'},
//     {name: 'Mary', lang: 'English'}
// ];

// csvWriter.writeRecords(records)       // returns a promise
//     .then(() => {
//         console.log('...Done');
//     });