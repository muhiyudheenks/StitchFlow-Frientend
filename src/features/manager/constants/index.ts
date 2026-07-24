import {
    FiGrid,
    FiUsers,
    FiCheckSquare,
    FiClock,
    FiCpu,
    FiBox,
    FiFileText,
} from 'react-icons/fi';
import { ManagerTab } from '../types';

export interface ManagerNavItem {
    id: ManagerTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
}

export const managerNavItems: ManagerNavItem[] = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'employees', label: 'Team Employees', icon: FiUsers, badge: '48' },
    { id: 'tasks', label: 'Task Management', icon: FiCheckSquare, badge: '6' },
    { id: 'attendance', label: 'Attendance & Leave', icon: FiClock, badge: '3' },
    { id: 'production', label: 'Production Line', icon: FiCpu, badge: 'Live' },
    { id: 'inventory', label: 'Inventory (Read-Only)', icon: FiBox },
    { id: 'reports', label: 'Reports & Analytics', icon: FiFileText },
];
