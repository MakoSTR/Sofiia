const fs = require('fs');

class FileReader {
    readFile = (filePath, filename) => {
        return fs.readFileSync(filePath + filename, {encoding:'utf8'});
    };
    appendFile = (filePath, data) => {
        fs.appendFileSync(filePath, `${data}\r\n`);
    };
}

const fileReader = new FileReader;

module.exports = fileReader;

