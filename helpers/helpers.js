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

module.exports = {
    createAuditMessage,
    disabler
}