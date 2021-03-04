import * as Yup from 'yup';

import { isValidDate } from '../util';

const firstStepCreateCallValidationSchema = Yup.object().shape({
  shortCode: Yup.string().required('Short Code is required'),
  startCall: Yup.date().required('Start call date is required'),
  endCall: Yup.date()
    .required('End call date is required')
    .when('startCall', (startCall: Date, schema: Yup.DateSchema) => {
      if (!isValidDate(startCall)) {
        return schema;
      }

      return schema.min(
        startCall,
        'End call date can not be before start call date.'
      );
    }),
  templateId: Yup.number().nullable().notRequired(),
  proposalWorkflowId: Yup.number().nullable().notRequired(),
});

const firstStepUpdateCallValidationSchema = firstStepCreateCallValidationSchema.concat(
  Yup.object()
    .shape({
      id: Yup.number().required('Id is required'),
    })
    .required()
);

const secondStepCallValidationSchema = Yup.object().shape({
  startReview: Yup.date().required('Start review date is required'),
  endReview: Yup.date()
    .required('End review date is required')
    .when('startReview', (startReview: Date, schema: Yup.DateSchema) => {
      if (!isValidDate(startReview)) {
        return schema;
      }

      return schema.min(
        startReview,
        'End review date can not be before start review date.'
      );
    }),
  startSEPReview: Yup.date().nullable().notRequired(),
  endSEPReview: Yup.date()
    .nullable()
    .notRequired()
    .when('startSEPReview', (startSEPReview: Date, schema: Yup.DateSchema) => {
      if (!isValidDate(startSEPReview)) {
        return schema;
      }

      return schema.min(
        startSEPReview,
        'End SEP review date can not be before start SEP review date.'
      );
    }),
  surveyComment: Yup.string()
    .max(100, 'Survey comment should be no longer than 100 characters')
    .required('Survey comment is required'),
});

const thirdStepCallValidationSchema = Yup.object().shape({
  startNotify: Yup.date().required('Start notify date is required'),
  endNotify: Yup.date()
    .required('End notify date is required')
    .when('startNotify', (startNotify: Date, schema: Yup.DateSchema) => {
      if (!isValidDate(startNotify)) {
        return schema;
      }

      return schema.min(
        startNotify,
        'End notify date can not be before start notify date.'
      );
    }),
  startCycle: Yup.date().required('Start cycle date is required'),
  endCycle: Yup.date()
    .required('End cycle date is required')
    .when('startCycle', (startCycle: Date, schema: Yup.DateSchema) => {
      if (!isValidDate(startCycle)) {
        return schema;
      }

      return schema.min(
        startCycle,
        'End cycle date can not be before start cycle date.'
      );
    }),
  cycleComment: Yup.string()
    .max(100, 'Cycle comment should be no longer than 100 characters')
    .required('Cycle comment is required'),
});

export const createCallValidationSchemas = [
  firstStepCreateCallValidationSchema,
  secondStepCallValidationSchema,
  thirdStepCallValidationSchema,
];

export const updateCallValidationSchemas = [
  firstStepUpdateCallValidationSchema,
  secondStepCallValidationSchema,
  thirdStepCallValidationSchema,
];

export const assignInstrumentsToCallValidationSchema = Yup.object().shape({
  callId: Yup.number().required('callId is required'),
  instrumentIds: Yup.array(Yup.number())
    .required('At least one instrumentId is required')
    .min(1),
});

export const removeAssignedInstrumentFromCallValidationSchema = Yup.object().shape(
  {
    callId: Yup.number().required('callId is required'),
    instrumentId: Yup.number().required('instrumentId is required'),
  }
);
