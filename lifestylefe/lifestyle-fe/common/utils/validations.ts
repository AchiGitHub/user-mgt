import * as yup from "yup";

export const durationsValidation = yup.object({
    durationType: yup.string().required("Duration type is required!"),
    duration: yup.number().required("Duration is required!"),
})