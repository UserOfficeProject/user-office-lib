import rewire from 'rewire';

import { populateFuncts } from '../create-service-description/createServiceDescription';

const app = rewire(
  '..\\..\\lib\\create-service-description\\createServiceDescription.js'
);

const createFunctArgDetails: any = app.__get__('createFunctArgDetails');

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

test('creates an object containing wrapper functions for all functions described by a web service description', () => {
  const service: any = {
    serviceDesc: { functions: { funct1: { input: {} } } },
  };

  expect(populateFuncts(service)).toHaveProperty('funct1');
});
