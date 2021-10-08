const { sendResult } = require('../app');

const sendResult = (foundAllergies, name, order) => {
    //main logic
    if (foundAllergies) {
        console.log(`${name} can’t order ${order}, allergic to: ${foundAllergies}`)
    }
    else console.log(`${name} - ${order}: success`)
};