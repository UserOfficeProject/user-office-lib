import * as Yup from 'yup';

export const createProposalStatusValidationSchema = Yup.object()
  .shape({
    name: Yup.string()
      .max(30)
      .trim()
      .test(
        'noWhiteSpaces',
        'Should not contain white spaces',
        value => !/\s/.test(value as string)
      )
      .uppercase()
      .required(),
    description: Yup.string()
      .max(200)
      .required(),
  })
  .strict(true);

export const updateProposalStatusValidationSchema = Yup.object()
  .shape({
    id: Yup.number().required(),
    name: Yup.string()
      .max(30)
      .trim()
      .test(
        'noWhiteSpaces',
        'Should not contain white spaces',
        value => !/\s/.test(value as string)
      )
      .uppercase()
      .required(),
    description: Yup.string()
      .max(200)
      .required(),
  })
  .strict(true);

export const deleteProposalStatusValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});
