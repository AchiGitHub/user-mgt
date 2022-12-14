import { MemberPayload } from "../utils/constants";

export type ToastType = {
    open: boolean,
    severity: "success" | "info" | "warning" | "error",
    message: string,
}

export type MembershipType = {
    id: string,
    membershipName: string,
    price: number | string,
    numberOfMembers: number,
    durationId: string
};

export type RegisterTypes = {
    name: string,
    membershipType: string,
    amount: string,
    startDate: string,
    endDate: string,
    users: typeof MemberPayload[]
}