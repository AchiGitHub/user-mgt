import * as yup from 'yup';
import { RegisterFormModel } from './constants';

const { formField: {
    name,
    membershipType,
    startDate,
    amount,
    paymentAmount,
    paymentType
} } = RegisterFormModel;

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    yup.object().shape({
        [membershipType.name]: yup.string().required(`${membershipType.requiredErrorMsg}`),
        [amount.name]: yup.number().required(`${amount.requiredErrorMsg}`),
        [paymentType.name]: yup.number().required(`${paymentType.requiredErrorMsg}`),
        [paymentAmount.name]: yup.number().required(`${paymentAmount.requiredErrorMsg}`),
    }),
    yup.object().shape({}),
    yup.object().shape({
        [paymentType.name]: yup.number().required(`${paymentType.requiredErrorMsg}`),
        [paymentAmount.name]: yup.number().required(`${paymentAmount.requiredErrorMsg}`),
    }),
]