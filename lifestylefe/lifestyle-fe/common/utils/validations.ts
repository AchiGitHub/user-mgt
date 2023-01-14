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

export const memberValidation = yup.object({
    firstName: yup.string().required("First name is required!"),
    lastName: yup.string().required("Last name is required!"),
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

export const getPath = (pathname: string) => {
    if (pathname === '/renewals') {
        return 'Membership Renewals';
    } else if (pathname === '/members') {
        return 'Members';
    } else if (pathname === '/membership/register') {
        return 'Registrations';
    } else if (pathname === '/duration') {
        return 'Durations';
    } else if (pathname === '/membership') {
        return 'Membership Types';
    } else if (pathname === '/store') {
        return 'Store';
    } else if (pathname === '/membership/add') {
        return 'Add Membership Type';
    } else if (pathname === '/membership/register/new') {
        return 'Add New Membership';
    } else if (pathname === '/membership/register/renew') {
        return 'Renew Membership';
    } else if (pathname === '/duration/add') {
        return 'Add Duration';
    } else if (pathname === '/store/add') {
        return 'Add Product';
    }
}