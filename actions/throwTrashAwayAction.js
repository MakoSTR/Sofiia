const fileReader = require("../servises/fileReader");
const helpers = require("../helpers/helpers");
const kitchenHandler = require("../handlers/kitchenHandler");
const trashService = require('../servises/trashService');
const command = require("../resources/input_files/commandConfiguration.json");

const throwTrashAwayAction = (i, filePathForOutput) => {
    if (command[i[0].toLowerCase()] === 'yes') { //якщо команда дозволена
        const trash = trashService.getTrash();
        const wastePool = trashService.addToWastePool(); //додати вміст смітника в wastePool

        fileReader.writeFile('./resources/output_files/wastePool.json', JSON.stringify(wastePool)); // запис wastePool у файл

        trashService.cleaner(); //очистити смітник

        const message = helpers.createAuditMessage(i, i);
        kitchenHandler.auditAction(message, trash);
        fileReader.appendFile(filePathForOutput, message);
    } else {
        helpers.disabler(i) //якщо команда не дозволена
    }
};

module.exports = { throwTrashAwayAction };

