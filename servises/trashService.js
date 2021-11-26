const fileReader = require("./fileReader");

class TrashService {
    constructor() {
        this.poisoned = false;
    }

    getPoisoned = () => {
        return  this.poisoned;
    }

    getWasteLimit = wasteLimit => {
        return wasteLimit >= 0 ? wasteLimit : 50;
    }

    getValues = (trash) => {
        return Object.values(trash);
    }

    getTotalSumFromTrash = (trash) => {
        const quantities = this.getValues(trash);
        return quantities.reduce((previousValue, currentValue) => {
            return previousValue +  currentValue
        }, 0);
    }

    checkFreeSpaceOfTrash = (wasteLimit, trash, wastedQuantity) => {
        const limit = this.getWasteLimit(wasteLimit);
        const totalSumFromTrash = this.getTotalSumFromTrash(trash)
        return totalSumFromTrash + wastedQuantity <= limit;
    }

    checkIsPoisoned = (trash, wasteLimit) => {
        const totalSum = this.getTotalSumFromTrash(trash);
        if (totalSum > wasteLimit) {
            return this.poisoned = true;
        }
    }

    addToTrash = (trash, ingredient, wastedQuantity) => {
        if (!!trash[ingredient]) {
            trash[`${ingredient}`] = trash[ingredient] + wastedQuantity;
        } else {
            trash[`${ingredient}`] = wastedQuantity;
        }
    }

    trashService = (wasteLimit, trash, wastedQuantity, ingredient) => {
        const freeSpace = this.checkFreeSpaceOfTrash(wasteLimit, trash, wastedQuantity);
        if (freeSpace) {
            this.addToTrash(trash, ingredient, wastedQuantity);
            fileReader.writeFile('./resources/output_files/trash.json', JSON.stringify(trash))
        } else {
            this.addToTrash(trash, ingredient, wastedQuantity);
            fileReader.writeFile('./resources/output_files/trash.json', JSON.stringify(trash))
            this.poisoned = true;
        }
    }
}

const trashService = new TrashService();

module.exports = trashService;