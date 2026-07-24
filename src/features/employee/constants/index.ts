import {
    FiHome,
    FiUser,
    FiCheckSquare,
    FiClock,
    FiCalendar,
    FiCpu,
    FiTrendingUp,
    FiDollarSign,
    FiBell,
    FiHelpCircle,
} from 'react-icons/fi';
import { EmployeeTab } from '../types';

export interface EmployeeNavItem {
    id: EmployeeTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
}

export const employeeNavItems: EmployeeNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'profile', label: 'My Profile', icon: FiUser },
    { id: 'tasks', label: 'My Tasks', icon: FiCheckSquare, badge: '3' },
    { id: 'attendance', label: 'Attendance', icon: FiClock },
    { id: 'leave', label: 'Leave Management', icon: FiCalendar },
    { id: 'production', label: 'My Production', icon: FiCpu, badge: 'Live' },
    { id: 'performance', label: 'My Performance', icon: FiTrendingUp },
    { id: 'salary', label: 'Salary', icon: FiDollarSign },
    { id: 'notifications', label: 'Notifications', icon: FiBell, badge: '1' },
    { id: 'support', label: 'Help & Support', icon: FiHelpCircle },
];
