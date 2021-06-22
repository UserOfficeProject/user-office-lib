import * as Yup from 'yup';

export const createProposalValidationSchema = Yup.object().shape({
  callId: Yup.number().required(),
});

export const updateProposalValidationSchema = Yup.object().shape({
  proposalPk: Yup.number().required(),
  title: Yup.string().notRequired(),
  abstract: Yup.string().notRequired(),
  answers: Yup.array().notRequired(),
  topicsCompleted: Yup.array().notRequired(),
  users: Yup.array().notRequired(),
  proposerId: Yup.number().notRequired(),
  partialSave: Yup.bool().notRequired(),
});

export const submitProposalValidationSchema = Yup.object().shape({
  proposalPk: Yup.number().required(),
});

export const deleteProposalValidationSchema = submitProposalValidationSchema;
export const proposalNotifyValidationSchema = submitProposalValidationSchema;

export const administrationProposalValidationSchema = Yup.object().shape({
  proposalPk: Yup.number().required(),
  statusId: Yup.number().nullable(),
  finalStatus: Yup.string().nullable(),
  commentForUser: Yup.string().nullable(),
  commentForManagement: Yup.string().nullable(),
  rankOrder: Yup.number()
    .min(0, ({ min }) => `Must be greater than or equal to ${min}`)
    .max(1e5, ({ max }) => `Must be less than or equal to ${max}`),
  managementTimeAllocation: Yup.number()
    .min(0, ({ min }) => `Must be greater than or equal to ${min}`)
    .max(1e5, ({ max }) => `Must be less than or equal to ${max}`)
    .nullable(),
  managementDecisionSubmitted: Yup.bool().nullable(),
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
