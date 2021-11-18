const FileReader = require('../servises/fileReader');

const fileReader = new FileReader();
const filePathForOutput = './resources/output_files/output.txt';

const createAuditMessage = (inputArr, resMessage) => {
    const inputString = inputArr.join();
    return `${inputString} => ${resMessage}`;
}

const disabler = (i) => {
    const message = `${i[0]} command disabled`;
    fileReader.appendFile (filePathForOutput, message);
    return message;
};

// checkAllIngredients (recursion)
const checkAllIngredients = (order, userIngredients, food, base) => {
    const ingredients = food[order];
    for ( let i = 0; i < ingredients.length; i++ ) {
        if (base.find(item => ingredients[i] === item )) {
            userIngredients.push(ingredients[i])
        } else {
            checkAllIngredients(ingredients[i], userIngredients, food, base)
        }
    }
};

module.exports = {
    createAuditMessage,
    disabler,
    checkAllIngredients
}