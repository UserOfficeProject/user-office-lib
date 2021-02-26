import * as Yup from 'yup';

const firstStepCreateCallValidationSchema = Yup.object().shape({
  shortCode: Yup.string().required('Short Code is required'),
  startCall: Yup.date().required('Start call date is required'),
  endCall: Yup.date().required('End call date is required'),
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
  endReview: Yup.date().required('End review date is required'),
  startSEPReview: Yup.date().nullable().notRequired(),
  endSEPReview: Yup.date().nullable().notRequired(),
  surveyComment: Yup.string()
    .max(100, 'Survey comment should be no longer than 100 characters')
    .required('Survey comment is required'),
});

const thirdStepCallValidationSchema = Yup.object().shape({
  startNotify: Yup.date().required('Start notify date is required'),
  endNotify: Yup.date().required('End notify date is required'),
  startCycle: Yup.date().required('Start cycle date is required'),
  endCycle: Yup.date().required('End cycle date is required'),
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
