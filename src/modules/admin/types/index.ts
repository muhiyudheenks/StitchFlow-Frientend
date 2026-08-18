export type AdminTab =
    | 'dashboard'
    | 'employees'
    | 'managers'
    | 'production'
    | 'inventory'
    | 'attendance'
    | 'analytics'
    | 'reports'
    | 'settings'
    | 'support';

export interface OverviewCardsData {
    totalEmployees: number;
    totalManagers: number;
    todayAttendanceCount: number;
    todayAttendanceRate: number;
    productionProgress: number;
    lowStockItemCount: number;
}

export type EmployeeType =
    | 'stitching_worker'
    | 'finishing_worker'
    | 'cutting_worker'
    | 'quality_checker'
    | 'packing_worker'
    | 'iron_staff'
    | 'helper'
    | null;

export interface Employee {
    id: string;
    name?: string;
    fullName?: string;
    avatar?: string;
    email: string;
    role?: string;
    employeeType?: EmployeeType;
    department?: string;
    designation?: string;
    status?: string;
    shift?: string;
    attendanceRate?: number;
    isVerified?: boolean;
    isBlock?: boolean;
    createdAt?: string;
}

export interface employeesResponse {
    success: boolean;
    message: string;
    employees?: Employee[];
    data?: Employee[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface Manager {
    id: string;
    name?: string;
    fullName?: string;
    avatar?: string;
    email: string;
    employeeType?: null;
    department?: string;
    designation?: string;
    employeesCount?: number;
    activeTasksCount?: number;
    performanceScore?: number;
    assignedLine?: string;
    status?: string;
    isVerified?: boolean;
    isBlock?: boolean;
    createdAt?: string;
}

export interface ProductionLine {
    id: string;
    name: string;
    targetPcs: number;
    completedPcs: number;
    efficiencyRate: number;
    activeWorkers: number;
    status: 'Optimal' | 'Warning' | 'Maintenance';
    stationLeader: string;
}

export interface MachineStatus {
    id: string;
    name: string;
    type: string;
    line: string;
    status: 'Operational' | 'Maintenance' | 'Idle';
    outputRate: string;
}

export interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    category: 'Raw Fabric' | 'Threads & Trims' | 'Finished Garment' | 'Packaging';
    quantity: number;
    unit: string;
    reorderLevel: number;
    status: 'In Stock' | 'Low Stock' | 'Critical';
    location: string;
}

export interface AttendanceRecord {
    id: string;
    employeeName: string;
    employeeId: string;
    department: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'Present' | 'Late' | 'Absent' | 'On Leave';
}

export interface RecentActivity {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'production' | 'attendance' | 'inventory' | 'employee' | 'system';
}
