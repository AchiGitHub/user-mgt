export type ToastType = {
    open: boolean,
    severity: "success" | "info" | "warning" | "error",
    message: string,
}

export type MembershipType = {
    id: string,
    membershipName: string,
    price: number | string,
    numberOfMembers: number | string,
    durationId: string
};