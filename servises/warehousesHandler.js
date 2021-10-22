const jsonData = require("../resources/input_files/data.json");
let warehouses = require("../resources/input_files/warehouses.json");

const baseIngredients = jsonData['Base ingredients'];
const dishes = Object.keys(jsonData.Food);
const food = jsonData.Food;
const base = jsonData['Base ingredients'];

class WarehousesHandler {
    checkAllIngredients = (order, userIngredients) => {
        const ingredients = food[order];
        for ( let i = 0; i < ingredients.length; i++ ) {
            if (base.find(item => ingredients[i] === item )) {
                userIngredients.push(ingredients[i])
            } else {
                this.checkAllIngredients(ingredients[i], userIngredients)
            }
        }
    };
    checkIsBaseIngredient = (order) => {
        return baseIngredients.filter(ingredient => ingredient === order)
    }
    checkIsDish = (order) => {
        return dishes.filter(dish => dish === order)
    }
    checkQuantitiesOfIngredients = (order) => {
        const userIngredients = [];
        this.checkAllIngredients(order, userIngredients)
        const warehousesCopy = { ...warehouses };
        const isLackOfQuantities = userIngredients.map(ingredient => this.reducer(ingredient, warehousesCopy))
            .find(e => e < 0);
        if (isLackOfQuantities < 0 ) {
            console.log('lack of ingredients')
            return true
        } else {
            warehouses = {...warehousesCopy};
            console.log(`${order}: all ingredients was in on the warehouses: quantities reduced`)
            return false
        }
    }
    reducer = (ingredient, warehouses) => {
            return warehouses[ingredient] = warehouses[ingredient] - 1;
    }
    reduceQuantities = (order) => {
        if (this.checkIsDish(order).length > 0 && warehouses[order] > 0) {
            this.reducer(order, warehouses);
            console.log(`${order} was on the warehouses: quantities reduced`)
        } else if (this.checkIsBaseIngredient(order).length > 0 && warehouses[order] > 0 ) {
            this.reducer(order, warehouses);
            console.log(`${order}(ing) was on the warehouses: quantities reduced`)
        } else if (this.checkIsDish(order).length > 0 && warehouses[order] === 0) {
            this.checkQuantitiesOfIngredients(order)
        }
        else console.log('warehouses is empty');
    }
}

const warehousesHandler = new WarehousesHandler();

module.exports = warehousesHandler;