import GroupIcon from '@mui/icons-material/Group';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Sidebar } from '../types/Sidebar';
import moment from 'moment';

export const BASE_URL = "http://localhost:9002/v1";

export const SidebarContent: Sidebar[] = [
    { text: 'Members', icon: GroupIcon, route: '/duration' },
    { text: 'Register', icon: AppRegistrationIcon, route: '/membership/register' },
    { text: 'Payments', icon: PaymentIcon, route: '/duration' },
    { text: 'Duration', icon: CalendarMonthIcon, route: '/duration' },
    { text: 'Membership Types', icon: ManageAccountsIcon, route: '/membership' },
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
]

export const MembershipTypeInitialValues = {
    id: "",
    membershipName: "",
    price: "",
    numberOfMembers: "",
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
    }
};

export const RegisterValues = {
    name: "",
    membershipType: '',
    amount: "",
    startDate: moment().toISOString(),
    endDate: moment().toISOString(),
    users: []
}

export const MemberPayload = {
    "firstName": "",
    "lastName": "",
    "dob": new Date().toISOString(),
    "nic": "",
    "address": "",
    "mobileNumber": "",
    "gender": 0
}