/* eslint-disable @typescript-eslint/camelcase */
import * as Yup from 'yup';

export const deleteUserValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});

export const createUserByEmailInviteValidationSchema = (UserRole: any) =>
  Yup.object().shape({
    firstname: Yup.string().required(),
    lastname: Yup.string().required(),
    email: Yup.string().email(),
    userRole: Yup.string()
      .oneOf(Object.keys(UserRole))
      .required(),
  });

const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const passwordValidationSchema = Yup.string()
  .required(
    'Password must contain at least 8 characters (including upper case, lower case and numbers)'
  )
  .matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
    'Password must contain at least 8 characters (including upper case, lower case and numbers)'
  );

export const createUserValidationSchema = Yup.object().shape({
  user_title: Yup.string().required(),
  firstname: Yup.string()
    .required()
    .min(2),
  middlename: Yup.string().notRequired(),
  lastname: Yup.string()
    .required()
    .min(2),
  password: passwordValidationSchema,
  preferredname: Yup.string().notRequired(),
  orcid: Yup.string().required(),
  orcidHash: Yup.string().required(),
  refreshToken: Yup.string().required(),
  gender: Yup.string().required(),
  nationality: Yup.number().required(),
  birthdate: Yup.date()
    .min(new Date(1900, 1, 1), 'You are not that old')
    .test('DOB', 'You must be at least 18 years old', value => {
      // to keep the current behavior after @types/yup upgrade:
      // if value is `null` or `undefined` return true explicitly
      // because new Date(null | undefined) evaluates to `Invalid date`
      // which return NaN for getFullYear()
      // and Number - NaN < 18 evaluates to false
      if (!value) {
        return true;
      }

      const dateOfBirth = new Date(value);
      const dateNow = new Date();

      if (dateNow.getFullYear() - dateOfBirth.getFullYear() < 18) {
        return false;
      } else {
        return true;
      }
    })
    .required('Please specify your birth date'),
  organisation: Yup.number().required(),
  department: Yup.string().required(),
  position: Yup.string().required(),
  email: Yup.string().email(),
  telephone: Yup.string()
    .min(2, 'telephone must be at least 2 characters')
    .max(30, 'telephone must be at most 20 characters')
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('telephone must be at least 2 characters'),
  telephone_alt: Yup.string()
    .min(2, 'telephone must be at least 2 characters')
    .max(30, 'telephone must be at most 20 characters')
    .matches(phoneRegExp, 'Phone number is not valid')
    .notRequired(),
});

export const updateUserValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  user_title: Yup.string().required(),
  firstname: Yup.string().required(),
  middlename: Yup.string().notRequired(),
  lastname: Yup.string().required(),
  username: Yup.string().required(),
  preferredname: Yup.string().notRequired(),
  gender: Yup.string().required(),
  nationality: Yup.number().required(),
  birthdate: Yup.date()
    .min(new Date(1900, 1, 1), 'You are not that old')
    .test('DOB', 'You must be at least 18 years old', value => {
      // to keep the current behavior after @types/yup upgrade:
      // if value is `null` or `undefined` return true explicitly
      // because new Date(null | undefined) evaluates to `Invalid date`
      // which return NaN for getFullYear()
      // and Number - NaN < 18 evaluates to false
      if (!value) {
        return true;
      }

      const dateOfBirth = new Date(value);
      const dateNow = new Date();

      if (dateNow.getFullYear() - dateOfBirth.getFullYear() < 18) {
        return false;
      } else {
        return true;
      }
    })
    .required(),
  organisation: Yup.number().required(),
  department: Yup.string().required(),
  position: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  telephone: Yup.string()
    .min(2, 'telephone must be at least 2 characters')
    .max(30, 'telephone must be at most 20 characters')
    .matches(phoneRegExp, 'Phone number is not valid')
    .required(),
  telephone_alt: Yup.string()
    .min(2, 'telephone must be at least 2 characters')
    .max(30, 'telephone must be at most 20 characters')
    .matches(phoneRegExp, 'Phone number is not valid')
    .notRequired(),
  placeholder: Yup.bool().notRequired(),
  roles: Yup.array()
    .of(Yup.number())
    .notRequired(),
  orcid: Yup.string().notRequired(),
  refreshToken: Yup.string().notRequired(),
});

export const updateUserRolesValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  roles: Yup.array()
    .of(Yup.number())
    .required(),
});

export const signInValidationSchema = Yup.object().shape({
  email: Yup.string().email(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(25, 'Password must be at most 25 characters')
    .required('Password must be at least 8 characters'),
});

export const getTokenForUserValidationSchema = Yup.object().shape({
  userId: Yup.number().required(),
});

export const resetPasswordByEmailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Please enter an email'),
});

export const addUserRoleValidationSchema = Yup.object().shape({
  userID: Yup.number().required(),
  roleID: Yup.number().required(),
});

export const updatePasswordValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  password: Yup.string().required(),
});

export const userPasswordFieldBEValidationSchema = Yup.object().shape({
  password: passwordValidationSchema,
  token: Yup.string().required(),
});

export const userPasswordFieldValidationSchema = Yup.object().shape({
  password: passwordValidationSchema,
  confirmPassword: Yup.string()
    .required()
    .label('Confirm password')
    .test('passwords-match', 'Passwords must match', function(value) {
      return this.parent.password === value;
    }),
});
