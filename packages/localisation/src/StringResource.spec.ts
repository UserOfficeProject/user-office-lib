import { getTranslation } from './StringResources';
test('Test translation', () => {
  expect(getTranslation('ACCOUNT_EXIST')).toBe('Account already exists');
});
