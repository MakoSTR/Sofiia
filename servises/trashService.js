class TrashService {
    constructor() {
        this.poisoned = false;
        this.trash = {};
        this.wastePool = {}
    }

    getTrash = () => {
        return this.trash;
    }

    getWastePool = () => {
        return this.wastePool;
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

    addToTrash = (ingredient, wastedQuantity) => {
        if (!!this.trash[ingredient]) {
            this.trash[`${ingredient}`] = this.trash[ingredient] + wastedQuantity;
        } else {
            this.trash[`${ingredient}`] = wastedQuantity;
        }
    }

    addToWastePool = (trash, wastePool) => {
        !Object.keys(wastePool).length ? this.wastePool = { ... this.trash } :
        Object.keys(wastePool).forEach(el => {
            Object.keys(trash).find(item => {
                if (item === el) {
                    return this.wastePool[el] += trash[item]
                } else {
                    return this.wastePool[el] = trash[item]
                }
            })
        })
    }

    trashService = (wasteLimit, trash, wastedQuantity, ingredient) => {
        const freeSpace = this.checkFreeSpaceOfTrash(wasteLimit, trash, wastedQuantity);
        if (freeSpace) {
            this.addToTrash(ingredient, wastedQuantity);
            // fileReader.writeFile('./resources/output_files/trash.json', JSON.stringify(trash))
        } else {
            this.addToTrash(ingredient, wastedQuantity);
            // fileReader.writeFile('./resources/output_files/trash.json', JSON.stringify(trash))
            this.poisoned = true;
        }
    }
}

const trashService = new TrashService();

module.exports = trashService;