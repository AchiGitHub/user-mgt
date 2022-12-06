export type ToastType = {
    open: boolean,
    severity: "success" | "info" | "warning" | "error",
    message: string,
}