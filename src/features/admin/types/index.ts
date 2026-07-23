export type AdminTab =
    | 'dashboard'
    | 'users'
    | 'employees'
    | 'managers'
    | 'production'
    | 'inventory'
    | 'attendance'
    | 'analytics'
    | 'reports'
    | 'settings';

export interface Employee {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    department: string;
    role: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    shift: 'Shift A' | 'Shift B' | 'Night Shift';
    attendanceRate: number;
}

export interface Manager {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    department: string;
    employeesCount: number;
    activeTasksCount: number;
    performanceScore: number;
    assignedLine: string;
    status: 'Active' | 'On Leave';
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
