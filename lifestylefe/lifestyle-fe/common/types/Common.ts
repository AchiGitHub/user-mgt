import { MemberPayload } from "../utils/constants";

export type ToastType = {
    open: boolean,
    severity: "success" | "info" | "warning" | "error",
    message: string,
}

export type MembershipType = {
    id: string,
    membershipName: string,
    price: number,
    numberOfMembers: number,
    durationId: string
};

export type RegisterTypes = {
    name: string,
    membershipType: string,
    amount: string,
    startDate: string,
    endDate: string,
    users: typeof MemberPayload[],
    paymentAmount: string,
    paymentType: number
}

export type RenewType = {
    name: string,
    membershipType: string,
    amount: string,
    startDate: string,
    endDate: string,
    users: typeof MemberPayload[],
    paymentAmount: string,
    paymentType: number
}

export type Member = {
    id: string,
    firstName: string,
    lastName: string,
    dob: string,
    nic: string,
    address: string,
    mobileNumber: string,
    secondaryNumber: string,
    occupation: string,
    gender: string
}

export type AutoCompleteProps = {
    id: string;
    label: string;
}

export type Product = {
    id?: string,
    productName: string,
    quantity: number | string,
    price: number | string,
    sellingPrice: number | string,
    productType: number | string,
    sold: number | string
}