const fs = require('fs');
const filePath = './resources/input_files/'

class FileReader {
    readFile = fileName => {
        return fs.readFileSync(filePath + fileName, {encoding:'utf8'});
    };
    appendFile = data => {
        return new Promise((res) => {
            fs.appendFile('./resources/output_files/outputBuy.txt', `${data}\r\n`, (err) => {
                if (err) return console.log(err);
            });
            res();
        });
    };
}

module.exports = {
    FileReader
};

