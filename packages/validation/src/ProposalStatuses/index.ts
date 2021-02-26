import * as Yup from 'yup';

export const createProposalStatusValidationSchema = Yup.object()
  .shape({
    shortCode: Yup.string()
      .max(50)
      .trim()
      .test(
        'noWhiteSpaces',
        'Should not contain white spaces',
        (value) => !/\s/.test(value as string)
      )
      .uppercase()
      .required(),
    name: Yup.string().max(100).required(),
    description: Yup.string().max(200).required(),
  })
  .strict(true);

export const updateProposalStatusValidationSchema = Yup.object()
  .shape({
    id: Yup.number().required(),
    shortCode: Yup.string()
      .max(50)
      .trim()
      .test(
        'noWhiteSpaces',
        'Should not contain white spaces',
        (value) => !/\s/.test(value as string)
      )
      .uppercase()
      .required(),
    name: Yup.string().max(100).required(),
    description: Yup.string().max(200).required(),
  })
  .strict(true);

export const deleteProposalStatusValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});
