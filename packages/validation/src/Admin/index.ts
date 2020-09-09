import * as Yup from 'yup';

export const setPageTextValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  text: Yup.string().notRequired(),
});
