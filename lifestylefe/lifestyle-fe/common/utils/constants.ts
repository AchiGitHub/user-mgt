import GroupIcon from '@mui/icons-material/Group';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import { Sidebar } from '../types/Sidebar';
import moment from 'moment';

// export const BASE_URL = "http://localhost:8080/v1";
export const BASE_URL = "https://lifestyle-service.fly.dev/v1";

export const SidebarContent: Sidebar[] = [
    { text: 'Members', icon: GroupIcon, route: '/members' },
    { text: 'Registrations', icon: AppRegistrationIcon, route: '/membership/register' },
    { text: 'Membership Renewals', icon: CurrencyExchangeIcon, route: '/renewals' },
    { text: 'Duration', icon: CalendarMonthIcon, route: '/duration' },
    { text: 'Membership Types', icon: ManageAccountsIcon, route: '/membership' },
    { text: 'Store', icon: PaymentIcon, route: '/store' },
];

export const DurationInitialValues = {
    durationType: "",
    duration: 0
};

export const Gender = [
    {
        id: 0,
        label: 'Male'
    },
    {
        id: 1,
        label: 'Female'
    },
];

export const PaymentTypes = [
    {
        id: 0,
        label: 'Cash'
    },
    {
        id: 1,
        label: 'Wire Transfer'
    },
];

export const MembershipTypeInitialValues = {
    id: "",
    membershipName: "",
    price: 0,
    numberOfMembers: 0,
    durationId: ""
};


export const RegisterFormModel = {
    formId: 'registerForm',
    formField: {
        membershipType: {
            name: 'membershipType',
            label: 'Membership Type',
            requiredErrorMsg: 'Membership Type is required'
        },
        startDate: {
            name: 'startDate',
            label: 'Start Date',
            requiredErrorMsg: 'Start Date is required'
        },
        endDate: {
            name: 'endDate',
            label: 'End Date',
            requiredErrorMsg: 'End Date is required'
        },
        amount: {
            name: 'amount',
            label: 'Amount',
            requiredErrorMsg: 'Amount is required'
        },
        name: {
            name: 'name',
            label: 'Registration Name',
            requiredErrorMsg: 'Registration Name is required'
        },
        paymentAmount: {
            name: 'paymentAmount',
            label: 'Payment Amount',
            requiredErrorMsg: 'Payment amount is required'
        },
        paymentType: {
            name: 'paymentType',
            label: 'Payment Type',
            requiredErrorMsg: 'Payment type is required'
        },
    }
};

export const RenewFormModel = {
    formId: 'renewForm',
    formField: {
        membershipType: {
            name: 'membershipType',
            label: 'Membership Type',
            requiredErrorMsg: 'Membership Type is required'
        },
        startDate: {
            name: 'startDate',
            label: 'Start Date',
            requiredErrorMsg: 'Start Date is required'
        },
        endDate: {
            name: 'endDate',
            label: 'End Date',
            requiredErrorMsg: 'End Date is required'
        },
        users: {
            name: 'users',
            label: "Member(s)",
            requiredErrorMsg: 'At least 1 member is required'
        },
        amount: {
            name: 'amount',
            label: 'Amount',
            requiredErrorMsg: 'Amount is required'
        },
        paymentAmount: {
            name: 'paymentAmount',
            label: 'Payment Amount',
            requiredErrorMsg: 'Payment amount is required'
        },
        paymentType: {
            name: 'paymentType',
            label: 'Payment Type',
            requiredErrorMsg: 'Payment type is required'
        },
    }
};

export const RegisterValues = {
    name: "",
    membershipType: '',
    amount: "",
    startDate: moment().toISOString(),
    endDate: moment().toISOString(),
    users: [],
    paymentAmount: 0,
    paymentType: 0
}

export const MemberPayload = {
    "firstName": "",
    "lastName": "",
    "dob": new Date().toISOString(),
    "nic": "",
    "address": "",
    "mobileNumber": "",
    "gender": 0,
    "occupation": "",
    "weight": 0,
    "height": 0,
}

export const RenewValues = {
    name: "",
    membershipType: '',
    amount: "",
    startDate: moment().toISOString(),
    endDate: moment().toISOString(),
    users: []
}

export const PaymentInitialValues = {
    paymentType: "",
    paymentAmount: ""
}

export const ProductInitialValues = {
    productName: "",
    quantity: "",
    price: "",
    sellingPrice: "",
    productType: "",
    sold: ""
}

export const ProductTypes = [
    {
        id: 0,
        label: 'Supplement'
    },
    {
        id: 1,
        label: 'Beverage'
    },
    {
        id: 2,
        label: 'Other'
    },
];

export const ProductMap: any = {
    "SUPPLEMENT": 0,
    "BEVERAGE": 1,
    "OTHER": 2,
}