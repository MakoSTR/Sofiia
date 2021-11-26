const fileReader = require("../servises/fileReader");
// const trash = require('../resources/output_files/trash.json');

const throwTrashAwayAction = (trash) => {
    const wastePool = {...trash}
    fileReader.writeFile('./resources/output_files/wastePool.json', JSON.stringify(wastePool))
    // fileReader.appendFile('./resources/output_files/trash.json', {})
};

module.exports = { throwTrashAwayAction };

// throwTrashAway(trash);