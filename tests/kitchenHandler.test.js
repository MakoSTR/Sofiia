const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const KitchenFacade = require("../handlers/kitchenHandler");
const kitchenFacade = new KitchenFacade();
const warehouseService = require("../servises/warehousesHandler");
const restaurantBudget = require('../servises/restaurantBudget');
const {expect} = require("chai");
const FileReader = require('../servises/fileReader');

const fileReader = new FileReader();

describe('KitchenFacade', () => {
    test('sendRestaurantBudget function: valid Restaurant Budget => should return 500', () => {
        chai.spy.on(restaurantBudget, 'getRestaurantBudget', () => 500);
        chai.spy.on(fileReader, 'appendFile', () => {});
        const res = kitchenFacade.sendRestaurantBudget();
        expect(res).to.equal(500)
    })
    // test('sendRestaurantBudget function: negative Restaurant Budget => should return RESTAURANT BANKRUPT', () => {
    //     chai.spy.on(restaurantBudget, 'getRestaurantBudget', () => -100);
    //     chai.spy.on(fileReader, 'appendFile', () => {});
    //     const res = kitchenFacade.sendRestaurantBudget();
    //     expect(res).to.equal('RESTAURANT BANKRUPT')
    // })

    test('order: should return \'test\', decreaseRestaurantBudget have to be called',  () => {
         chai.spy.on(warehouseService, "getWarehouses", () => ({ "Tuna": 2 }));
         chai.spy.on(restaurantBudget, 'decreaseRestaurantBudget', () => 'Test');
        const res = kitchenFacade.order("Tuna", 1, 10);
        expect(restaurantBudget.decreaseRestaurantBudget).to.have.been.called();
        expect(restaurantBudget.decreaseRestaurantBudget).to.have.been.called.with('Tuna', 1, 10);
        expect(res).to.equal('Test');
    });
});