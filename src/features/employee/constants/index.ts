import {
    FiHome,
    FiUser,
    FiCheckSquare,
    FiClock,
    FiCpu,
    FiTrendingUp,
    FiBell,
    FiHelpCircle,
} from 'react-icons/fi';
import { FaIndianRupeeSign } from 'react-icons/fa6';
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
    { id: 'production', label: 'My Production', icon: FiCpu, badge: 'Live' },
    { id: 'performance', label: 'My Performance', icon: FiTrendingUp },
    { id: 'salary', label: 'Salary', icon: FaIndianRupeeSign },
    { id: 'notifications', label: 'Notifications', icon: FiBell, badge: '1' },
    { id: 'support', label: 'Help & Support', icon: FiHelpCircle },
];
