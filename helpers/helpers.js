const fileReader = require('../servises/fileReader');
const filePathForOutput = './resources/output_files/output.txt';

const createAuditMessage = (inputArr, resMessage) => { //створює меседжі для аутпуту та/або аудиту
    const inputString = inputArr.join();
    return `${inputString} => ${resMessage}`;
}

const disabler = (i) => { //у випадку, коли команда недозволена
    const message = `${i[0]} command disabled`;
    fileReader.appendFile (filePathForOutput, message);
    return message;
};

// checkAllIngredients (recursion)
const checkAllIngredients = (order, userIngredients, food, base) => {
    const ingredients = food[order]; // тут береться склад страви (той що прописаний в файлі)
    for ( let i = 0; i < ingredients.length; i++ ) {
        if (base.find(item => ingredients[i] === item )) { //якщо інградієнт базовий пушимо його в масив
            userIngredients.push(ingredients[i])
        } else {
            checkAllIngredients(ingredients[i], userIngredients, food, base) //запускаємо ф-ю знову (рекурсія), бо елемент не базовий інградієнт
        }
    }
};

module.exports = {
    createAuditMessage,
    disabler,
    checkAllIngredients
}