const fs = require('fs');

class FileWriter {
    writeFile = data => {
        return fs.appendFile('./resources/output_files/outputBuy.txt', `${data} + \n`, (err) => {
            if (err) return console.log(err);
        });
    };
}

module.exports = {
    FileWriter
};