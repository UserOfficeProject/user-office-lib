import rewire from 'rewire';

const app = rewire('..\\..\\lib\\constructFunctions.js');

const mapDataType: any = app.__get__('mapDataType');
const constructFunctArgString: any = app.__get__('constructFunctArgString');

test('maps a non-list type to any', () => {
  expect(mapDataType('Decimal')).toBe('any');
});

test('maps a list type to any[]', () => {
  expect(mapDataType('Decimal[]')).toBe('any[]');
});

test('constructs function argument string (without corresponding type) from a 2D array of argument names and types', () => {
  expect(constructFunctArgString([['arg1', 'string']], false)).toBe('arg1');
});

test('constructs function arguments string (without corresponding types) from a 2D array of argument names and types', () => {
  expect(
    constructFunctArgString(
      [
        ['arg1', 'string'],
        ['arg2', 'string[]'],
      ],
      false
    )
  ).toBe('arg1, arg2');
});

test('constructs empty function arguments string (without corresponding types) from a 2D array of argument names and types', () => {
  expect(constructFunctArgString([], false)).toBe('');
});

test('constructs function argument string (with corresponding type) from a 2D array of argument names and types', () => {
  expect(constructFunctArgString([['arg1', 'string']], true)).toBe('arg1: any');
});

test('constructs function arguments (with corresponding types) from a 2D array of argument names and types', () => {
  expect(
    constructFunctArgString(
      [
        ['arg1', 'string'],
        ['arg2', 'string[]'],
      ],
      true
    )
  ).toBe('arg1: any, arg2: any[]');
});

test('constructs empty function arguments string (with corresponding types) from an exmpty 2D array of argument names and types', () => {
  expect(constructFunctArgString([], true)).toBe('');
});
