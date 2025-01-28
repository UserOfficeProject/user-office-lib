import * as Yup from 'yup';

export const createWorkflowValidationSchema = Yup.object().shape({
  name: Yup.string().max(50).required(),
  description: Yup.string().max(200).required(),
  entityType: Yup.string().oneOf(['proposal', 'experiment']).required(),
});

export const updateWorkflowValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  name: Yup.string().max(50).required(),
  description: Yup.string().max(200).required(),
});

export const deleteWorkflowValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});

export const addWorkflowStatusValidationSchema = Yup.object().shape({
  workflowId: Yup.number().required(),
  sortOrder: Yup.number().required(),
  droppableGroupId: Yup.string().required(),
  parentDroppableGroupId: Yup.string().nullable().notRequired(),
  statusId: Yup.number().required(),
  nextStatusId: Yup.number().nullable().notRequired(),
  prevStatusId: Yup.number().nullable().notRequired(),
});

export const moveWorkflowStatusValidationSchema = Yup.object().shape({
  from: Yup.number().required(),
  to: Yup.number().required(),
  workflowId: Yup.number().required(),
});

export const deleteWorkflowStatusValidationSchema = Yup.object().shape({
  statusId: Yup.number().required(),
  workflowId: Yup.number().required(),
});

export const addNextStatusEventsValidationSchema = Yup.object().shape({
  workflowConnectionId: Yup.number().required(),
  nextStatusEvents: Yup.array().of(Yup.string()).required(),
});

export const addStatusActionsToConnectionValidationSchema = <T>(
  emailStatusActionType: T,
  rabbitMQStatusActionType: T,
  statusActionTypes: T[]
) =>
  Yup.object().shape({
    connectionId: Yup.number().required(),
    workflowId: Yup.number().required(),
    actions: Yup.array()
      .of(
        Yup.object().shape({
          actionId: Yup.number().required(),
          actionType: Yup.mixed<T>().oneOf(statusActionTypes).required(),
          config: Yup.object().test(
            'RecipientWithTemplate',
            'Invalid values provided for action config',
            (value: any, context: any) => {
              switch (context.parent.actionType) {
                case emailStatusActionType: {
                  // NOTE: Value here is: EmailActionConfig from the core codebase
                  if (value.recipientsWithEmailTemplate?.length) {
                    const filteredNonCompleteValues =
                      value.recipientsWithEmailTemplate.filter(
                        (item: any) =>
                          !item.recipient?.name || !item.emailTemplate?.id
                      );

                    if (filteredNonCompleteValues.length) {
                      return false;
                    }

                    return true;
                  } else {
                    return false;
                  }
                }
                case rabbitMQStatusActionType: {
                  // NOTE: Value here is: RabbitMQActionConfig from the core codebase
                  if (value.exchanges?.length) {
                    return true;
                  } else {
                    return false;
                  }
                }
                default:
                  return false;
              }
            }
          ),
        })
      )
      .notRequired(),
  });
