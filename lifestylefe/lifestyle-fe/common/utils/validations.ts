import * as yup from "yup";
import { MemberPayload } from "./constants";

export const durationsValidation = yup.object({
    durationType: yup.string().required("Duration type is required!"),
    duration: yup.number().required("Duration is required!"),
})

export const membershiptypeValidation = yup.object({
    membershipName: yup.string().required("Membership name is required!"),
    price: yup.number().required("Price is required!"),
    numberOfMembers: yup.number().required("Number of members required!"),
    durationId: yup.string().required("Duration is required!")
});

export const productValidation = yup.object({
    productName: yup.string().required("Product name is required!"),
    quantity: yup.number().required("Quantity is required!"),
    price: yup.number().required("Price is required!"),
    sellingPrice: yup.number().required("Selling price is required!"),
});

export const sellProductValidation = yup.object({
    id: yup.string().required("Product is required!"),
    quantity: yup.number().required("Quantity is required!"),
});


export const getDropdownValues = (arr: any[], labelName: string) => {
    return arr.map((item, idx) => {
        return {
            id: item.id,
            label: item[labelName]
        }
    })
};

export const getUsersArray = (num: number) => {
    const userArray = [];
    for (let i = 0; i < num; i++) {
        userArray.push(MemberPayload)
    }
    return userArray;
}