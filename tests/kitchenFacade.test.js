const KitchenFacade = require("../facades/kitchenFacade");
// const audit = require("../servises/audit");
const kitchenFacade = new KitchenFacade();
//
// describe("auditAction", () => {
//    test.only("test", () => {
//       const spy = jest.fn();
//       jest
//           .spyOn(audit, "addToAudit")
//           .mockImplementation(() => true);
//
//       kitchenFacade.auditAction("Test");
//
//       expect(spy).lastCalledWith({  });
//    })
// });

describe('KitchenFacade', () => {
    test('sendRestaurantBudget', () => {
        const res = kitchenFacade.sendRestaurantBudget();
        expect(res).toBe(500)
    })
});