import GroupIcon from '@mui/icons-material/Group';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Sidebar } from '../types/Sidebar';

export const BASE_URL = "http://localhost:9002/v1";

export const SidebarContent: Sidebar[] = [
    { text: 'Members', icon: GroupIcon, route: '/duration' },
    { text: 'Register', icon: AppRegistrationIcon, route: '/duration' },
    { text: 'Payments', icon: PaymentIcon, route: '/duration' },
    { text: 'Duration', icon: CalendarMonthIcon, route: '/duration' },
    { text: 'Membership Types', icon: ManageAccountsIcon, route: '/duration' },
];

export const DurationInitialValues = {
    durationType: "",
    duration: 0
};
