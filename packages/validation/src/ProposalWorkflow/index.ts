import * as Yup from 'yup';

export const createProposalWorkflowValidationSchema = Yup.object().shape({
  name: Yup.string().max(50).required(),
  description: Yup.string().max(200).required(),
});

export const updateProposalWorkflowValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  name: Yup.string().max(50).required(),
  description: Yup.string().max(200).required(),
});

export const deleteProposalWorkflowValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});

export const addProposalWorkflowStatusValidationSchema = Yup.object().shape({
  proposalWorkflowId: Yup.number().required(),
  sortOrder: Yup.number().required(),
  droppableGroupId: Yup.string().required(),
  parentDroppableGroupId: Yup.string().nullable().notRequired(),
  proposalStatusId: Yup.number().required(),
  nextProposalStatusId: Yup.number().nullable().notRequired(),
  prevProposalStatusId: Yup.number().nullable().notRequired(),
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

export const addNextStatusEventsValidationSchema = Yup.object().shape({
  proposalWorkflowConnectionId: Yup.number().required(),
  nextStatusEvents: Yup.array().of(Yup.string()).required(),
});

export const addStatusActionsToConnectionValidationSchema = <T>(
  emailStatusActionType: T,
  rabbitMQStatusActionType: T,
  proposalStatusActionTypes: T[]
) =>
  Yup.object().shape({
    connectionId: Yup.number().required(),
    workflowId: Yup.number().required(),
    actions: Yup.array()
      .of(
        Yup.object().shape({
          actionId: Yup.number().required(),
          actionType: Yup.mixed<T>()
            .oneOf(proposalStatusActionTypes)
            .required(),
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
