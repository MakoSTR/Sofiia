const fs = require('fs');
const filePath = './resources/input_files/'

class FileReader {
    readFile = (fileName) => {
        return fs.readFileSync(filePath + fileName, {encoding:'utf8'});
    };
}

module.exports = {
    FileReader
};

