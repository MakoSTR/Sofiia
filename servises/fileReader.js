const fs = require('fs');
const filePath = './resources/input_files/'

class FileReader {
    readFile = fileName => {
        return fs.readFileSync(filePath + fileName, {encoding:'utf8'});
    };
    appendFile = data => {
        fs.appendFileSync('./resources/output_files/outputBuy.txt', `${data}\r\n`);
    };
}

module.exports = {
    FileReader
};

