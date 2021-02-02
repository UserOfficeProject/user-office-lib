import * as Yup from 'yup';

export const setPageTextValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  text: Yup.string().notRequired(),
});

export const createApiAccessTokenValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  accessPermissions: Yup.array()
    .of(Yup.string())
    .required('You must select at least one query or mutation for access'),
});

export const updateApiAccessTokenValidationSchema = (
  isBackendValidation: boolean
) =>
  Yup.object().shape({
    accessTokenId: isBackendValidation
      ? Yup.string().required()
      : Yup.string().notRequired(),
    name: Yup.string().required(),
    accessPermissions: isBackendValidation
      ? Yup.string()
          .min(5)
          .required('You must select at least one query or mutation for access')
      : Yup.array()
          .of(Yup.string())
          .required(
            'You must select at least one query or mutation for access'
          ),
  });
