import * as Yup from 'yup';

export const createProposalValidationSchema = Yup.object().shape({
  callId: Yup.number().required(),
});

export const updateProposalValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  title: Yup.string().notRequired(),
  abstract: Yup.string().notRequired(),
  answers: Yup.array().notRequired(),
  topicsCompleted: Yup.array().notRequired(),
  users: Yup.array().notRequired(),
  proposerId: Yup.number().notRequired(),
  partialSave: Yup.bool().notRequired(),
});

export const submitProposalValidationSchema = Yup.object().shape({
  proposalId: Yup.number().required(),
});

export const deleteProposalValidationSchema = submitProposalValidationSchema;
export const proposalNotifyValidationSchema = submitProposalValidationSchema;

export const administrationProposalBEValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  finalStatus: Yup.string().nullable(),
  status: Yup.string().nullable(),
  commentForUser: Yup.string().nullable(),
  commentForManagement: Yup.string().nullable(),
});

export const administrationProposalValidationSchema = Yup.object().shape({
  status: Yup.string().nullable(),
  timeAllocation: Yup.number().nullable(),
  comment: Yup.string().nullable(),
  publicComment: Yup.string().nullable(),
});

const MAX_TITLE_LEN = 175;
const MAX_ABSTRACT_LEN = 1500;

export const generalInfoUpdateValidationSchema = Yup.object().shape({
  title: Yup.string()
    .max(MAX_TITLE_LEN, 'Title must be at most 175 characters')
    .required('Title is required'),
  abstract: Yup.string()
    .max(MAX_ABSTRACT_LEN, 'Abstract must be at most 1500 characters')
    .required('Abstract is required'),
});
