const { main } = require('../main/main');


const mockCallback = jest.fn(x => 42 + x)

test.only('main fn', () => {
    // const newArr = ['Buy', 'Alexandra Smith', 'Fries']
    // main(newArr);
    // expect(main).toBe('Alexandra Smith');
});

