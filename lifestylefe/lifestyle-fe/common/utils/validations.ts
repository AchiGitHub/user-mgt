import * as yup from "yup";

export const durationsValidation = yup.object({
    durationType: yup.string().required("Duration type is required!"),
    duration: yup.number().required("Duration is required!"),
})

export const membershiptypeValidation = yup.object({
    membershipName: yup.string().required("Membership name is required!"),
    price: yup.number().required("Price is required!"),
    numberOfMembers: yup.number().required("Number of members required!"),
    durationId: yup.string().required("Duration is required!")
})