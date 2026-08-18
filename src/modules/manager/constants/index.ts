import {
    FiGrid,
    FiUsers,
    FiCheckSquare,
    FiClock,
    FiCpu,
    FiBox,
    FiFileText,
    FiHelpCircle,
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
    { id: 'employees', label: 'Team Employees', icon: FiUsers },
    { id: 'tasks', label: 'Task Management', icon: FiCheckSquare },
    { id: 'attendance', label: 'Attendance & Leave', icon: FiClock },
    { id: 'production', label: 'My Assigned Batches', icon: FiCpu },
    { id: 'inventory', label: 'Inventory (Read-Only)', icon: FiBox },
    { id: 'reports', label: 'Reports & Analytics', icon: FiFileText },
    { id: 'support', label: 'Help & Support', icon: FiHelpCircle },
];
