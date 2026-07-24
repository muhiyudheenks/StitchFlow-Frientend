export type ManagerTab =
    | 'overview'
    | 'employees'
    | 'tasks'
    | 'attendance'
    | 'production'
    | 'inventory'
    | 'reports';

export interface ManagerTask {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed';
    assignee: string;
    deadline: string;
    department: string;
}

export interface ManagerProductionBatch {
    id: string;
    batchNumber: string;
    productName: string;
    targetQuantity: number;
    completedQuantity: number;
    line: string;
    status: 'planned' | 'in_production' | 'quality_check' | 'completed';
    dueDate: string;
}

export interface ManagerTeamEmployee {
    id: string;
    name: string;
    email: string;
    department: string;
    designation: string;
    status: 'active' | 'inactive' | 'on_leave';
    phone: string;
    isVerified: boolean;
    attendanceRate: number;
    assignedTasks: number;
}

export interface ManagerAttendanceRecord {
    id: string;
    employeeName: string;
    department: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'present' | 'absent' | 'late' | 'on_leave';
    isApproved: boolean;
}

export interface ManagerLeaveRequest {
    id: string;
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface ManagerInventoryItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    reorderLevel: number;
    status: 'in_stock' | 'low_stock' | 'critical';
}

export interface ManagerReportItem {
    id: string;
    title: string;
    category: string;
    generatedAt: string;
    format: string;
    downloadUrl: string;
}
