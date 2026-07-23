import {
    Employee,
    Manager,
    ProductionLine,
    MachineStatus,
    InventoryItem,
    AttendanceRecord,
    RecentActivity
} from '../types';

export const mockKpis = [
    {
        title: 'Total Employees',
        value: '340',
        change: '+12 this month',
        trend: 'up',
        badge: 'Floor Workers'
    },
    {
        title: 'Active Managers',
        value: '18',
        change: '6 Line Supervisors',
        trend: 'up',
        badge: '100% Active'
    },
    {
        title: "Today's Attendance",
        value: '95.4%',
        change: '324 / 340 Present',
        trend: 'up',
        badge: 'Shift A & B'
    },
    {
        title: 'Production Output',
        value: '2,140 pcs',
        change: 'Target: 2,500 pcs',
        trend: 'up',
        badge: '85.6% Achieved'
    },
    {
        title: 'Inventory Capacity',
        value: '14,250 reels',
        change: '95% Thread Stocks',
        trend: 'neutral',
        badge: 'Synced'
    },
    {
        title: 'Est. Revenue Growth',
        value: '$284,500',
        change: '+18.4% vs last month',
        trend: 'up',
        badge: 'Q3 Enterprise'
    }
];

export const mockEmployees: Employee[] = [
    {
        id: 'EMP-1001',
        name: 'Sarah Jenkins',
        email: 'sarah.j@stitchflow.com',
        department: 'Cutting & Laying',
        role: 'Senior Fabric Cutter',
        status: 'Active',
        shift: 'Shift A',
        attendanceRate: 98.5
    },
    {
        id: 'EMP-1002',
        name: 'Michael Chen',
        email: 'michael.c@stitchflow.com',
        department: 'Collar Assembly',
        role: 'Overlock Operator',
        status: 'Active',
        shift: 'Shift A',
        attendanceRate: 96.2
    },
    {
        id: 'EMP-1003',
        name: 'Elena Rostova',
        email: 'elena.r@stitchflow.com',
        department: 'Quality Assurance',
        role: 'Senior QMS Inspector',
        status: 'Active',
        shift: 'Shift B',
        attendanceRate: 99.1
    },
    {
        id: 'EMP-1004',
        name: 'David Okafor',
        email: 'david.o@stitchflow.com',
        department: 'Sleeve Stitching',
        role: 'Machine Technician',
        status: 'On Leave',
        shift: 'Shift A',
        attendanceRate: 92.0
    },
    {
        id: 'EMP-1005',
        name: 'Priya Sharma',
        email: 'priya.s@stitchflow.com',
        department: 'Button & Hemming',
        role: 'Automation Specialist',
        status: 'Active',
        shift: 'Shift B',
        attendanceRate: 97.8
    },
    {
        id: 'EMP-1006',
        name: 'Carlos Mendez',
        email: 'carlos.m@stitchflow.com',
        department: 'Finishing & Pressing',
        role: 'Steam Press Operator',
        status: 'Active',
        shift: 'Shift A',
        attendanceRate: 94.5
    },
    {
        id: 'EMP-1007',
        name: 'Aisha Bekele',
        email: 'aisha.b@stitchflow.com',
        department: 'Packaging & Dispatch',
        role: 'Logistics Supervisor',
        status: 'Active',
        shift: 'Night Shift',
        attendanceRate: 98.0
    }
];

export const mockManagers: Manager[] = [
    {
        id: 'MGR-01',
        name: 'Robert Vance',
        email: 'robert.v@stitchflow.com',
        department: 'Assembly Line 1 (Denim)',
        employeesCount: 28,
        activeTasksCount: 6,
        performanceScore: 98,
        assignedLine: 'Line A - Jacket Production',
        status: 'Active'
    },
    {
        id: 'MGR-02',
        name: 'Amanda Lin',
        email: 'amanda.l@stitchflow.com',
        department: 'Assembly Line 2 (Shirts)',
        employeesCount: 32,
        activeTasksCount: 4,
        performanceScore: 95,
        assignedLine: 'Line B - Casual Shirts',
        status: 'Active'
    },
    {
        id: 'MGR-03',
        name: 'Marcus Brody',
        email: 'marcus.b@stitchflow.com',
        department: 'Quality & Audit Control',
        employeesCount: 16,
        activeTasksCount: 8,
        performanceScore: 99,
        assignedLine: 'QMS Central Lab',
        status: 'Active'
    },
    {
        id: 'MGR-04',
        name: 'Sophia Patel',
        email: 'sophia.p@stitchflow.com',
        department: 'Cutting & Fabric Mill',
        employeesCount: 24,
        activeTasksCount: 5,
        performanceScore: 93,
        assignedLine: 'Cutting Station Alpha',
        status: 'Active'
    }
];

export const mockProductionLines: ProductionLine[] = [
    {
        id: 'LINE-01',
        name: 'Line A - Denim Outerwear',
        targetPcs: 1200,
        completedPcs: 1080,
        efficiencyRate: 96.4,
        activeWorkers: 32,
        status: 'Optimal',
        stationLeader: 'Robert Vance'
    },
    {
        id: 'LINE-02',
        name: 'Line B - Premium Cotton Shirts',
        targetPcs: 800,
        completedPcs: 690,
        efficiencyRate: 91.2,
        activeWorkers: 24,
        status: 'Optimal',
        stationLeader: 'Amanda Lin'
    },
    {
        id: 'LINE-03',
        name: 'Line C - Sportswear & Knits',
        targetPcs: 500,
        completedPcs: 370,
        efficiencyRate: 84.5,
        activeWorkers: 18,
        status: 'Warning',
        stationLeader: 'David Okafor'
    }
];

export const mockMachineStatuses: MachineStatus[] = [
    { id: 'M-101', name: 'Juki DDL-9000C', type: 'Single Needle Lockstitch', line: 'Line A', status: 'Operational', outputRate: '142 pcs/hr' },
    { id: 'M-102', name: 'Brother S-7300A', type: 'Direct Drive Lockstitch', line: 'Line A', status: 'Operational', outputRate: '138 pcs/hr' },
    { id: 'M-103', name: 'Pegasus M900', type: 'Overlock Machine', line: 'Line B', status: 'Operational', outputRate: '150 pcs/hr' },
    { id: 'M-104', name: 'Lectra Vector IX', type: 'Automated Fabric Cutter', line: 'Cutting Station', status: 'Maintenance', outputRate: '0 pcs/hr' },
    { id: 'M-105', name: 'Yamato FD-62G', type: 'Feed-off-the-arm Seamer', line: 'Line C', status: 'Idle', outputRate: '95 pcs/hr' }
];

export const mockInventoryItems: InventoryItem[] = [
    {
        id: 'INV-301',
        sku: 'FAB-DENIM-12OZ',
        name: 'Heavyweight Denim Fabric (12oz)',
        category: 'Raw Fabric',
        quantity: 4500,
        unit: 'Meters',
        reorderLevel: 1000,
        status: 'In Stock',
        location: 'Warehouse A - Bay 3'
    },
    {
        id: 'INV-302',
        sku: 'THR-COT-INDIGO',
        name: 'Reinforced Indigo Thread Spools',
        category: 'Threads & Trims',
        quantity: 820,
        unit: 'Spools',
        reorderLevel: 1000,
        status: 'Low Stock',
        location: 'Storage Rack B2'
    },
    {
        id: 'INV-303',
        sku: 'BTN-BRASS-18MM',
        name: 'Antique Brass Rivet Buttons',
        category: 'Threads & Trims',
        quantity: 32000,
        unit: 'Pieces',
        reorderLevel: 5000,
        status: 'In Stock',
        location: 'Bin C-14'
    },
    {
        id: 'INV-304',
        sku: 'GAR-JKT-XL',
        name: 'Finished Heritage Denim Jacket (XL)',
        category: 'Finished Garment',
        quantity: 1450,
        unit: 'Units',
        reorderLevel: 200,
        status: 'In Stock',
        location: 'Dispatch Hub 1'
    },
    {
        id: 'INV-305',
        sku: 'PKG-BOX-LRG',
        name: 'Eco Garment Shipping Cartons',
        category: 'Packaging',
        quantity: 180,
        unit: 'Boxes',
        reorderLevel: 500,
        status: 'Critical',
        location: 'Packaging Area'
    }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
    { id: 'ATT-801', employeeName: 'Sarah Jenkins', employeeId: 'EMP-1001', department: 'Cutting & Laying', date: 'Today', checkIn: '08:00 AM', checkOut: '05:00 PM', status: 'Present' },
    { id: 'ATT-802', employeeName: 'Michael Chen', employeeId: 'EMP-1002', department: 'Collar Assembly', date: 'Today', checkIn: '08:05 AM', checkOut: '05:00 PM', status: 'Present' },
    { id: 'ATT-803', employeeName: 'Elena Rostova', employeeId: 'EMP-1003', department: 'Quality Assurance', date: 'Today', checkIn: '08:22 AM', checkOut: '05:00 PM', status: 'Late' },
    { id: 'ATT-804', employeeName: 'David Okafor', employeeId: 'EMP-1004', department: 'Sleeve Stitching', date: 'Today', checkIn: '-', checkOut: '-', status: 'On Leave' },
    { id: 'ATT-805', employeeName: 'Priya Sharma', employeeId: 'EMP-1005', department: 'Button & Hemming', date: 'Today', checkIn: '08:00 AM', checkOut: '05:00 PM', status: 'Present' }
];

export const mockRecentActivities: RecentActivity[] = [
    { id: 'ACT-1', title: 'Line A Target Reached', description: 'Batch #GAR-8092 completed 1,080 Denim Jackets ahead of shift target.', time: '10 mins ago', type: 'production' },
    { id: 'ACT-2', title: 'QMS Defect Audit Logged', description: 'Inspector Elena flagged 4 seam puckering cases in Lot #DF-9921.', time: '28 mins ago', type: 'production' },
    { id: 'ACT-3', title: 'Shift A Attendance Synced', description: '95.4% floor workers clocked in via biometrics.', time: '1 hour ago', type: 'attendance' },
    { id: 'ACT-4', title: 'Low Stock Alert Triggered', description: 'Indigo Thread Spools dropped below 1,000 unit threshold.', time: '2 hours ago', type: 'inventory' },
    { id: 'ACT-5', title: 'New Worker Onboarded', description: 'Aisha Bekele assigned to Logistics & Packaging Team.', time: '4 hours ago', type: 'employee' }
];
