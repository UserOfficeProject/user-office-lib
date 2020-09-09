import * as Yup from 'yup';

export const proposalGradeValidationSchema = Yup.object().shape({
  comment: Yup.string()
    .max(500, 'Too long comment')
    .nullable(),
  grade: Yup.number()
    .min(0, 'Lowest grade is 0')
    .max(10, 'Highest grade is 10')
    .nullable(),
});

export const proposalTechnicalReviewValidationSchema = Yup.object().shape({
  status: Yup.string().nullable(),
  timeAllocation: Yup.number().nullable(),
  comment: Yup.string().nullable(),
  publicComment: Yup.string().nullable(),
});

export const removeUserForReviewValidationSchema = Yup.object().shape({
  reviewID: Yup.number().required(),
});

export const addUserForReviewValidationSchema = Yup.object().shape({
  userID: Yup.number().required(),
  proposalID: Yup.number().required(),
});
