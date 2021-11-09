const { lineReader } = require('../main/lineReader');
const { main } = require('../main/main');
const { disabler } = require('../helpers/helpers');


const arr = ['sd','sdd','test'];
const i = arr[0];
const mockDisabler = jest.fn(x => 42 + x)
main(arr);

test('mock', () => {

})
