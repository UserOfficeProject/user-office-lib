import * as Yup from 'yup';

export const createTechniqueValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  shortCode: Yup.string().required(),
  description: Yup.string().required(),
});

export const updateTechniqueValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  name: Yup.string().required(),
  shortCode: Yup.string().required(),
  description: Yup.string().required(),
});

export const deleteTechniqueValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});
