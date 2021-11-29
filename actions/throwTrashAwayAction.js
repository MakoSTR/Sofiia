const fileReader = require("../servises/fileReader");
const helpers = require("../helpers/helpers");
const kitchenHandler = require("../handlers/kitchenHandler");
const trashService = require('../servises/trashService');

const throwTrashAwayAction = (trash, wastePool, i, filePathForOutput) => {
    // const getTrash = trashService.getTrash();
    // const getWastePool = trashService.getWastePool();

    trashService.addToWastePool(trash, wastePool);
    // const wastePoolUpd = trashService.getWastePool();
    console.log(wastePool)

    fileReader.writeFile('./resources/output_files/wastePool.json', JSON.stringify(wastePool));

    trashService.trash = {}; //очищує смітник

    const message = helpers.createAuditMessage(i, i);
    kitchenHandler.auditAction(message, trash);
    fileReader.appendFile(filePathForOutput, message);
};

module.exports = { throwTrashAwayAction };

