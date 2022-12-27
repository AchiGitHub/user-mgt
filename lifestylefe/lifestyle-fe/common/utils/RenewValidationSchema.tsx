import * as yup from 'yup';
import { RegisterFormModel, RenewFormModel } from './constants';

const { formField: {
    membershipType,
    amount,
    paymentAmount,
    paymentType,
    users
} } = RenewFormModel;

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    yup.object().shape({
        [membershipType.name]: yup.string().required(`${membershipType.requiredErrorMsg}`),
        [amount.name]: yup.number().required(`${amount.requiredErrorMsg}`),
        [users.name]: yup.array().required(`${amount.requiredErrorMsg}`),
    }),
    yup.object().shape({
        [paymentType.name]: yup.number().required(`${paymentType.requiredErrorMsg}`),
        [paymentAmount.name]: yup.number().required(`${paymentAmount.requiredErrorMsg}`),
    }),
]