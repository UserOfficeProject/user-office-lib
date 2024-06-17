import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import { AnyObject } from 'yup/lib/types';

export const instrumentPickerValidationSchema = (field: any) => {
  const config = field.config;

  interface ValidationSchema {
    instrumentId: string | undefined;
    timeRequested: string | null | undefined;
  }

  let schema:
    | Yup.ArraySchema<SchemaOf<ValidationSchema>, AnyObject>
    | SchemaOf<ValidationSchema>;

  schema = Yup.object().shape({
    instrumentId: Yup.string(),
    timeRequested: Yup.string(),
  });

  if (config.isMultipleSelect) {
    if (config.required) {
      schema = Yup.array().of(
        Yup.object().shape({
          instrumentId: Yup.string().required(),
          timeRequested: Yup.string(),
        })
      );
    }
    if (config.requestTime) {
      schema = Yup.array().of(
        Yup.object().shape({
          instrumentId: Yup.string(),
          timeRequested: Yup.string()
            .required('Requested time is required')
            .test('is-number?', 'Requested time is not valid', (value) => {
              if (Number(value) < 0 || isNaN(Number(value))) return false;
              else return true;
            }),
        })
      );
    }
  } else {
    if (config.required) {
      schema = Yup.object().shape({
        instrumentId: Yup.string().required(),
        timeRequested: Yup.string(),
      });
    }
    if (config.requestTime) {
      schema = Yup.object().shape({
        instrumentId: Yup.string(),
        timeRequested: Yup.string()
          .required('Requested time is required')
          .test('is-number?', 'Requested time is not valid', (value) => {
            if (Number(value) < 0 || isNaN(Number(value))) return false;
            else return true;
          }),
      });
    }
  }

  return schema;
};
