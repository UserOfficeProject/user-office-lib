import * as Yup from 'yup';

export const createSEPValidationSchema = Yup.object().shape({
  code: Yup.string().required(),
  description: Yup.string().required(),
  numberRatingsRequired: Yup.number().min(2).required(),
});

export const updateSEPValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  code: Yup.string().required(),
  description: Yup.string().required(),
  numberRatingsRequired: Yup.number().min(2).required(),
});

export const assignSEPChairOrSecretaryValidationSchema = (UserRole: any) =>
  Yup.object().shape({
    assignChairOrSecretaryToSEPInput: Yup.object()
      .shape({
        userId: Yup.number().required(),
        roleId: Yup.number()
          .oneOf([UserRole.SEP_CHAIR, UserRole.SEP_SECRETARY])
          .required(),
        sepId: Yup.number().required(),
      })
      .required(),
  });

export const assignSEPMembersValidationSchema = Yup.object().shape({
  memberIds: Yup.array(Yup.number()).required(),
  sepId: Yup.number().required(),
});

export const removeSEPMemberValidationSchema = Yup.object().shape({
  memberId: Yup.number().required(),
  sepId: Yup.number().required(),
});

export const assignProposalToSEPValidationSchema = Yup.object().shape({
  proposalPk: Yup.number().required(),
  sepId: Yup.number().required(),
});

export const assignSEPMemberToProposalValidationSchema = Yup.object().shape({
  proposalPk: Yup.number().required(),
  sepId: Yup.number().required(),
  memberId: Yup.number().required(),
});

export const updateTimeAllocationValidationSchema = Yup.object({
  sepId: Yup.number().required(),
  proposalPk: Yup.number().required(),
  sepTimeAllocation: Yup.number()
    .min(0, ({ min }) => `Must be greater than or equal to ${min}`)
    .max(1e5, ({ max }) => `Must be less than or equal to ${max}`)
    .nullable(),
});

export const saveSepMeetingDecisionValidationSchema = Yup.object().shape({
  proposalPk: Yup.number().required(),
  commentForUser: Yup.string().nullable(),
  commentForManagement: Yup.string().nullable(),
  recommendation: Yup.string().nullable(),
  rankOrder: Yup.number()
    .min(0, ({ min }) => `Must be greater than or equal to ${min}`)
    .max(1e5, ({ max }) => `Must be less than or equal to ${max}`),
  submitted: Yup.bool().nullable(),
});

export const overwriteSepMeetingDecisionRankingValidationSchema =
  Yup.object().shape({
    proposalPk: Yup.number().required(),
    rankOrder: Yup.number()
      .min(0, ({ min }) => `Must be greater than or equal to ${min}`)
      .max(1e5, ({ max }) => `Must be less than or equal to ${max}`),
  });
