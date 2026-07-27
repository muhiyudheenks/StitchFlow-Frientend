import api from '@/config';

export interface FabricItemData {
    _id?: string;
    id?: string;
    fabricId?: string;
    fabricName: string;
    fabricType: string;
    gsm: number;
    color: string;
    width: string;
    rollNumber?: string;
    supplier: string;
    purchaseDate?: string;
    unit: 'Meters' | 'Kg';
    currentStock: number;
    minimumStock: number;
    unitCost: number;
    totalValue?: number;
    warehouseLocation: string;
    status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface ThreadItemData {
    _id?: string;
    id?: string;
    threadId?: string;
    threadType: string;
    color: string;
    brand: string;
    supplier: string;
    unit: 'Spools' | 'Cones' | 'Yards';
    currentStock: number;
    minimumStock: number;
    unitCost: number;
    totalValue?: number;
    warehouse: string;
    status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface GarmentItemData {
    _id?: string;
    id?: string;
    productId?: string;
    productName: string;
    styleNumber: string;
    category: string;
    size: string;
    color: string;
    quantityAvailable: number;
    quantityReserved: number;
    totalQuantity?: number;
    productionDate?: string;
    warehouse: string;
    unitCost: number;
    sellingPrice: number;
    status?: 'Ready' | 'Reserved' | 'Dispatched';
}

export interface InventorySummaryData {
    totalFabricStock: number;
    totalThreadStock: number;
    finishedGarmentsCount: number;
    lowStockItemsCount: number;
    inventoryValue: number;
}

export interface InventoryAnalyticsData {
    fabricConsumption: number;
    threadConsumption: number;
    finishedProduction: number;
    lowStockCount: number;
}

export interface InventoryTransactionData {
    _id: string;
    date: string;
    item: string;
    itemType: 'Fabric' | 'Thread' | 'Finished Garment';
    quantity: number;
    movementType: 'Purchase' | 'Production' | 'Adjustment' | 'Return';
    user: string;
    notes?: string;
}

// Service Methods
export const inventoryService = {
    // Fabric
    getFabrics: async (params?: Record<string, any>) => {
        const response = await api.get('/api/inventory/fabric', { params });
        return response.data;
    },
    createFabric: async (data: FabricItemData) => {
        const response = await api.post('/api/inventory/fabric', data);
        return response.data;
    },
    updateFabric: async (id: string, data: Partial<FabricItemData>) => {
        const response = await api.put(`/api/inventory/fabric/${id}`, data);
        return response.data;
    },
    deleteFabric: async (id: string) => {
        const response = await api.delete(`/api/inventory/fabric/${id}`);
        return response.data;
    },

    // Thread
    getThreads: async (params?: Record<string, any>) => {
        const response = await api.get('/api/inventory/thread', { params });
        return response.data;
    },
    createThread: async (data: ThreadItemData) => {
        const response = await api.post('/api/inventory/thread', data);
        return response.data;
    },
    updateThread: async (id: string, data: Partial<ThreadItemData>) => {
        const response = await api.put(`/api/inventory/thread/${id}`, data);
        return response.data;
    },
    deleteThread: async (id: string) => {
        const response = await api.delete(`/api/inventory/thread/${id}`);
        return response.data;
    },

    // Garments
    getGarments: async (params?: Record<string, any>) => {
        const response = await api.get('/api/inventory/garments', { params });
        return response.data;
    },
    createGarment: async (data: GarmentItemData) => {
        const response = await api.post('/api/inventory/garments', data);
        return response.data;
    },
    updateGarment: async (id: string, data: Partial<GarmentItemData>) => {
        const response = await api.put(`/api/inventory/garments/${id}`, data);
        return response.data;
    },
    deleteGarment: async (id: string) => {
        const response = await api.delete(`/api/inventory/garments/${id}`);
        return response.data;
    },

    // Summary, Analytics & Transactions
    getSummary: async () => {
        const response = await api.get('/api/inventory/summary');
        return response.data?.data;
    },
    getAnalytics: async () => {
        const response = await api.get('/api/inventory/analytics');
        return response.data?.data;
    },
    getTransactions: async (params?: Record<string, any>) => {
        const response = await api.get('/api/inventory/transactions', { params });
        return response.data;
    },
};
