import api from '@/config';

export interface CreateBatchPayload {
    batchName: string;
    managerId: string;
    notes?: string;
    status?: string;
}

export interface UpdateBatchTeamPayload {
    employeeIds: string[];
    finishingWorkerIds: string[];
}

export interface BatchTaskData {
    _id?: string;
    id?: string;
    batch: string;
    garmentProduct: string;
    operationName: string;
    assignedTo: string | any;
    assignedToName?: string;
    taskType: 'Stitching' | 'Finishing' | 'General';
    quantity: number;
    completedQuantity: number;
    startDate?: string;
    dueDate?: string;
    estimatedDuration?: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'Pending' | 'In Progress' | 'Quality Check' | 'Completed';
    instructions?: string;
}

export interface ProductionBatchData {
    _id?: string;
    id?: string;
    batchName: string;
    manager: string | any;
    managerName?: string;
    employees?: any[];
    employeesCount?: number;
    finishingWorkers?: any[];
    finishingWorkersCount?: number;
    notes?: string;
    status: 'UNASSIGNED' | 'PENDING_MANAGER' | 'ASSIGNED' | 'IN_PROGRESS' | 'ACTIVE' | 'Active' | 'In Progress' | 'Completed' | 'COMPLETED' | 'CANCELLED' | 'On Hold';
    tasks?: BatchTaskData[];
    totalTasks?: number;
    completedTasks?: number;
    progressPercentage?: number;
    createdAt?: string;
}

export const productionService = {
    getBatches: async () => {
        const response = await api.get('/api/production');
        return response.data?.data || [];
    },
    createBatch: async (data: CreateBatchPayload) => {
        const response = await api.post('/api/production', data);
        return response.data?.data;
    },
    updateBatch: async (id: string, data: Partial<CreateBatchPayload & { status: string }>) => {
        const response = await api.put(`/api/production/${id}`, data);
        return response.data?.data;
    },
    updateBatchTeam: async (id: string, data: UpdateBatchTeamPayload) => {
        const response = await api.patch(`/api/production/${id}/team`, data);
        return response.data?.data;
    },

    // Task Assignment inside Batch
    getBatchTasks: async (batchId: string) => {
        const response = await api.get(`/api/production/${batchId}/tasks`);
        return response.data?.data || [];
    },
    createBatchTask: async (batchId: string, data: Partial<BatchTaskData>) => {
        const response = await api.post(`/api/production/${batchId}/tasks`, data);
        return response.data?.data;
    },
    updateBatchTask: async (taskId: string, data: Partial<BatchTaskData>) => {
        const response = await api.put(`/api/production/tasks/${taskId}`, data);
        return response.data?.data;
    },
    deleteBatchTask: async (taskId: string) => {
        const response = await api.delete(`/api/production/tasks/${taskId}`);
        return response.data;
    },
};
