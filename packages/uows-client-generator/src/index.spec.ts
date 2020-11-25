import rewire from 'rewire';

const app = rewire('..\\lib\\index');

const mapDataType: any = app.__get__('mapDataType');
const constructFunctArgString: any = app.__get__('constructFunctArgString');
const createFunctArgDetails: any = app.__get__('createFunctArgDetails');

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

test('ignores specified argument names, returning an empty list', () => {
  expect(
    createFunctArgDetails({
      input: { targetNSAlias: 'String', targetNamespace: 'String' },
    })
  ).toEqual([]);
});

test('creates empty list when there are no arguments', () => {
  expect(
    createFunctArgDetails({
      input: {},
    })
  ).toEqual([]);
});

test('assigns a function arguments name as its type when it is an objct', () => {
  expect(
    createFunctArgDetails({
      input: { complexObject: { key: 'value' } },
    })
  ).toEqual([['complexObject', 'complexObject']]);
});

test('creates a list containing one list consisting of argument name and its type from a function description object', () => {
  expect(
    createFunctArgDetails({
      input: { arg1: 'String' },
    })
  ).toEqual([['arg1', 'String']]);
});

test('creates a list containing one list consisting of argument name and its type from a function description object, recognises that there is a list', () => {
  expect(
    createFunctArgDetails({
      input: { 'arg1[]': 'String' },
    })
  ).toEqual([['arg1', 'String[]']]);
});

test('creates a list containing two lists consisting of argument names and types from a function description object', () => {
  expect(
    createFunctArgDetails({
      input: { arg1: 'String', arg2: 'Decimal' },
    })
  ).toEqual([
    ['arg1', 'String'],
    ['arg2', 'Decimal'],
  ]);
});
