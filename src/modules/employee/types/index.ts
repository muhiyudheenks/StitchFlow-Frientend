export type EmployeeTab =
    | 'dashboard'
    | 'profile'
    | 'tasks'
    | 'attendance'
    | 'leave'
    | 'production'
    | 'performance'
    | 'salary'
    | 'notifications'
    | 'support';

export interface EmployeeHero {
    employeeName: string;
    greeting: string;
    department: string;
    designation: string;
    shift: string;
    currentDate: string;
    todayAttendanceStatus: string;
}

export interface EmployeeKpis {
    todayAttendanceStatus: string;
    pendingTasksCount: number;
    completedTasksCount: number;
    monthlyAttendanceRate: number;
    performanceScore: number;
    todayProduction: number;
    targetProduction: number;
}

export interface EmployeeProfile {
    id: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
    designation: string;
    shift: string;
    joiningDate: string;
    reportingManager: string;
    phone: string;
    address: string;
    emergencyContact: string;
}

export interface EmployeeTask {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed';
    deadline: string;
    progress: number;
}

export interface EmployeeAttendanceLog {
    id: string;
    date: string;
    checkIn: string;
    checkOut: string;
    hours: string;
    status: 'present' | 'late' | 'absent' | 'on_leave';
}

export interface EmployeeLeaveRequest {
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface EmployeeProduction {
    assignedBatchNumber: string;
    productName: string;
    assignedLine: string;
    todayTarget: number;
    completedQty: number;
    remainingQty: number;
    efficiency: number;
}

export interface EmployeePerformance {
    productivityScore: number;
    attendanceScore: number;
    qualityScore: number;
    overallEfficiency: number;
    monthlyTrend: { month: string; score: number }[];
}

export interface EmployeeSalary {
    baseSalary: string;
    overtime: string;
    incentives: string;
    netPay: string;
    lastPayDate: string;
    payslips: { month: string; amount: string; status: string; downloadUrl: string }[];
}

export interface EmployeeNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
}

export interface EmployeeActivity {
    id: string;
    title: string;
    time: string;
    type: 'attendance' | 'task' | 'production' | 'leave';
}

export interface EmployeeFaq {
    question: string;
    answer: string;
}
