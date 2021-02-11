import * as Yup from 'yup';

export const createSEPValidationSchema = Yup.object().shape({
  code: Yup.string().required(),
  description: Yup.string().required(),
  numberRatingsRequired: Yup.number()
    .min(2)
    .required(),
});

export const updateSEPValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  code: Yup.string().required(),
  description: Yup.string().required(),
  numberRatingsRequired: Yup.number()
    .min(2)
    .required(),
});

export const assignSEPChairOrSecretaryValidationSchema = (UserRole: any) =>
  Yup.object().shape({
    addSEPMembersRole: Yup.object()
      .shape({
        userIDs: Yup.array(Yup.number()).required(),
        roleID: Yup.number()
          .oneOf([UserRole.SEP_CHAIR, UserRole.SEP_SECRETARY])
          .required(),
        SEPID: Yup.number().required(),
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
  proposalId: Yup.number().required(),
  sepId: Yup.number().required(),
});

export const assignSEPMemberToProposalValidationSchema = Yup.object().shape({
  proposalId: Yup.number().required(),
  sepId: Yup.number().required(),
  memberId: Yup.number().required(),
});

export const updateTimeAllocationValidationSchema = Yup.object({
  sepId: Yup.number().required(),
  proposalId: Yup.number().required(),
  sepTimeAllocation: Yup.number()
    .min(0, ({ min }) => `Must be greater than or equal to ${min}`)
    .max(1e5, ({ max }) => `Must be less than or equal to ${max}`)
    .nullable(),
});
