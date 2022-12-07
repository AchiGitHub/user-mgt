import * as yup from 'yup';
import { RegisterFormModel } from './constants';

const { formField: {
    name,
} } = RegisterFormModel;

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    yup.object().shape({
        [name.name]: yup.string().required(`${name.requiredErrorMsg}`)
    })
]