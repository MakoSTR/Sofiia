const jsonData = require("../resources/input_files/data.json");
const warehouses = require("../resources/input_files/warehouses.json");
const messageCodes = require("../resources/messageCodes.json");

const baseIngredients = jsonData['Base ingredients'];
const dishes = Object.keys(jsonData.Food);
const food = jsonData.Food;
const base = jsonData['Base ingredients'];

class WarehousesHandler {
    constructor() {
        this.warehouses = warehouses;
    }

    checkAllIngredients = (order, userIngredients, warehouses) => {
        const ingredients = food[order];
        for ( let i = 0; i < ingredients.length; i++ ) {
            const checkExistsOfIng = base.some(item => warehouses[ingredients[i]] > 0 || ingredients[i] === item);
            if (checkExistsOfIng) {
                userIngredients.push(ingredients[i]);
            } else {
                this.checkAllIngredients(ingredients[i], userIngredients, warehouses)
            }
        }
    }

    checkIsBaseIngredient = (order) => {
        return baseIngredients.filter(ingredient => ingredient === order)
    }

    checkIsDish = (order) => {
        return dishes.filter(dish => dish === order)
    }
    checkQuantitiesOfIngredients = (order) => {
        const warehousesCopy = { ...this.warehouses };
        const isLackOfQuantities = this.checkDishIngredientsInWarehouse(order, warehousesCopy);
        if (isLackOfQuantities < 0 ) {
            console.log('lack of ingredients')
            return { flag: true, message: 'lack of ingredients' }
        } else {
            this.warehouses = {...warehousesCopy};
            console.log(`${order}: all ingredients was in on the warehouses: quantities reduced`)
            return { flag: false, code: messageCodes.success, message:`${order}: all ingredients was in on the warehouses: quantities reduced` }
        }
    }
    reducer = (ingredient, warehouses) => {
            return warehouses[ingredient] = warehouses[ingredient] - 1;
    }
    reduceQuantities = (order, warehouses) => {
        if (this.checkIsDish(order).length > 0 && warehouses[order] > 0) {
            this.reducer(order, warehouses);
            console.log(`${order} was on the warehouses: quantities reduced`)
            return { code: messageCodes.success, message: `${order} was on the warehouses: quantities reduced` };
        } else if (this.checkIsBaseIngredient(order).length > 0 && this.warehouses[order] > 0 ) {
            this.reducer(order, warehouses);
            console.log(`${order}(ing) was on the warehouses: quantities reduced`)
            return { code: messageCodes.success, message: `${order}(ing) was on the warehouses: quantities reduced` };
        } else if (this.checkIsDish(order).length > 0 && this.warehouses[order] === 0) {
            this.checkQuantitiesOfIngredients(order)
        }
        else console.log('warehouses is empty');
        return 'warehouses is empty';
    }

    checkDishIngredientsInWarehouse = (order, warehousesCopy) => {
        const userIngredients = [];
        this.checkAllIngredients(order, userIngredients, this.warehouses);

        return userIngredients
            .map(ingredient => this.reducer(ingredient, warehousesCopy))
            .find(e => e < 0) || false;
    }

    getWarehouses = () => {
        return this.warehouses;
    }

    setWarehouses = (customWarehouses) => {
        this.warehouses = customWarehouses;
    }

    getValues = (warehouses) => {
        return Object.values(warehouses);
    }

    getTotalSumFromWarehouse = (warehouses) => {
        const quantities = this.getValues(warehouses);
        return quantities.reduce((previousValue, currentValue) => {
            return previousValue +  currentValue
        }, 0);
    }

    getAmountFromWarehouse = (warehouses, ingredient) => {
        return warehouses[ingredient];
    }

    checkWarehouseSpace = (warehouses, number, totalMax, ingredient, localMax) => {
        const quantityAmount = parseInt(number);
        const totalSumFromWarehouse = this.getTotalSumFromWarehouse(warehouses);
        const localSumFromWarehouse = this.getAmountFromWarehouse(warehouses, ingredient)

        //100 total
        if (totalMax - totalSumFromWarehouse >= quantityAmount) {
            //100 local
            if(localMax - localSumFromWarehouse >= quantityAmount) {
                return { res: true }
            }
            //50/50 local
            if (localMax - localSumFromWarehouse > 0) {
                const freeSpace = localMax - localSumFromWarehouse;
                const wastedQuantity = quantityAmount - freeSpace;
                return { res: false, freeSpace, wastedQuantity };
            }
            //0 local => return false
            return { res: false, wastedQuantity: quantityAmount };
        }
        // 50/50 total
        if (totalMax - totalSumFromWarehouse > 0 ) {
            const freeSpaceTotal = totalMax - totalSumFromWarehouse;
            //50/50 local
            if (localMax - localSumFromWarehouse > 0) {
                const freeSpaceLocal = localMax - localSumFromWarehouse;
                const freeSpace =  freeSpaceLocal < freeSpaceTotal ? freeSpaceLocal : freeSpaceTotal;
                const wastedQuantity = quantityAmount - freeSpace;
                return { res: false, freeSpace, wastedQuantity };
            }
            //0 local => return false
            return { res: false, wastedQuantity: quantityAmount };
        }
        //0 total  => return false
        return { res: false, wastedQuantity: quantityAmount };
    }

    addIngredients = (warehouses, ingredient, quantity) => {
        return warehouses[ingredient] = parseInt(quantity) + warehouses[ingredient];
    }
}

const warehousesService = new WarehousesHandler();

module.exports = warehousesService;