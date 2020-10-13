import * as Yup from 'yup';

export const createCallValidationSchema = Yup.object().shape({
  shortCode: Yup.string().required('Short Code is required'),
  startCall: Yup.date().required('Start call date is required'),
  endCall: Yup.date().required('End call date is required'),
  startReview: Yup.date().required('Start review date is required'),
  endReview: Yup.date().required('End review date is required'),
  startNotify: Yup.date().required('Start notify date is required'),
  endNotify: Yup.date().required('End notify date is required'),
  cycleComment: Yup.string().required('Cycle comment is required'),
  surveyComment: Yup.string().required('Survey comment is required'),
  startCycle: Yup.date().required('Start cycle date is required'),
  endCycle: Yup.date().required('End cycle date is required'),
  proposalWorkflowId: Yup.number()
    .nullable()
    .notRequired(),
  templateId: Yup.number()
    .nullable()
    .notRequired(),
});

export const updateCallValidationSchema = Yup.object().shape({
  id: Yup.number().required('Id is required'),
  shortCode: Yup.string().required('Short Code is required'),
  startCall: Yup.date().required('Start call date is required'),
  endCall: Yup.date().required('End call date is required'),
  startReview: Yup.date().required('Start review date is required'),
  endReview: Yup.date().required('End review date is required'),
  startNotify: Yup.date().required('Start notify date is required'),
  endNotify: Yup.date().required('End notify date is required'),
  cycleComment: Yup.string().required('Cycle comment is required'),
  surveyComment: Yup.string().required('Survey comment is required'),
  startCycle: Yup.date().required('Start cycle date is required'),
  endCycle: Yup.date().required('End cycle date is required'),
  proposalWorkflowId: Yup.number()
    .nullable()
    .notRequired(),
  templateId: Yup.number()
    .nullable()
    .notRequired(),
});

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
