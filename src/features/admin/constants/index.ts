import {
    FiGrid,
    FiUserPlus,
    FiUsers,
    FiUserCheck,
    FiCpu,
    FiBox,
    FiCalendar,
    FiBarChart2,
    FiFileText,
    FiSettings
} from 'react-icons/fi';
import { AdminTab } from '../types';

export interface NavItem {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
}

export const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'users', label: 'User Management', icon: FiUserPlus, badge: 'New' },
    { id: 'employees', label: 'Employees', icon: FiUsers, badge: '340' },
    { id: 'managers', label: 'Managers', icon: FiUserCheck, badge: '18' },
    { id: 'production', label: 'Production', icon: FiCpu, badge: 'Live' },
    { id: 'inventory', label: 'Inventory', icon: FiBox },
    { id: 'attendance', label: 'Attendance', icon: FiCalendar },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
    { id: 'reports', label: 'Reports', icon: FiFileText },
    { id: 'settings', label: 'Settings', icon: FiSettings },
];
