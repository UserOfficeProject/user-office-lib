import * as Yup from 'yup';

export const createProposalWorkflowValidationSchema = Yup.object().shape({
  name: Yup.string()
    .max(50)
    .required(),
  description: Yup.string()
    .max(200)
    .required(),
});

export const updateProposalWorkflowValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  name: Yup.string()
    .max(50)
    .required(),
  description: Yup.string()
    .max(200)
    .required(),
});

export const deleteProposalWorkflowValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});

export const addProposalWorkflowStatusValidationSchema = Yup.object().shape({
  proposalWorkflowId: Yup.number().required(),
  sortOrder: Yup.number().required(),
  proposalStatusId: Yup.number().required(),
  nextProposalStatusId: Yup.number().notRequired(),
  prevProposalStatusId: Yup.number().notRequired(),
  nextStatusEventType: Yup.string().required(),
});

export const moveProposalWorkflowStatusValidationSchema = Yup.object().shape({
  from: Yup.number().required(),
  to: Yup.number().required(),
  proposalWorkflowId: Yup.number().required(),
});

export const deleteProposalWorkflowStatusValidationSchema = Yup.object().shape({
  proposalStatusId: Yup.number().required(),
  proposalWorkflowId: Yup.number().required(),
});
