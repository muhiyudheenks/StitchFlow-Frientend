import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    inventoryService,
    FabricItemData,
    ThreadItemData,
    GarmentItemData
} from '../services/inventory-service';

export function useFabricInventory(params?: Record<string, any>) {
    return useQuery({
        queryKey: ['inventory-fabric', params],
        queryFn: () => inventoryService.getFabrics(params),
    });
}

export function useThreadInventory(params?: Record<string, any>) {
    return useQuery({
        queryKey: ['inventory-thread', params],
        queryFn: () => inventoryService.getThreads(params),
    });
}

export function useGarmentInventory(params?: Record<string, any>) {
    return useQuery({
        queryKey: ['inventory-garments', params],
        queryFn: () => inventoryService.getGarments(params),
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['inventory-categories'],
        queryFn: () => inventoryService.getCategories(),
    });
}

export function useWarehouses() {
    return useQuery({
        queryKey: ['inventory-warehouses'],
        queryFn: () => inventoryService.getWarehouses(),
    });
}

export function useInventorySummary() {
    return useQuery({
        queryKey: ['inventory-summary'],
        queryFn: () => inventoryService.getSummary(),
    });
}

export function useInventoryAnalytics() {
    return useQuery({
        queryKey: ['inventory-analytics'],
        queryFn: () => inventoryService.getAnalytics(),
    });
}

export function useInventoryTransactions(params?: Record<string, any>) {
    return useQuery({
        queryKey: ['inventory-transactions', params],
        queryFn: () => inventoryService.getTransactions(params),
    });
}

// Mutations
export function useFabricMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-fabric'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
    };

    const createFabric = useMutation({
        mutationFn: (data: FabricItemData) => inventoryService.createFabric(data),
        onSuccess: invalidateAll,
    });

    const updateFabric = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<FabricItemData> }) =>
            inventoryService.updateFabric(id, data),
        onSuccess: invalidateAll,
    });

    const deleteFabric = useMutation({
        mutationFn: (id: string) => inventoryService.deleteFabric(id),
        onSuccess: invalidateAll,
    });

    return { createFabric, updateFabric, deleteFabric };
}

export function useThreadMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-thread'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
    };

    const createThread = useMutation({
        mutationFn: (data: ThreadItemData) => inventoryService.createThread(data),
        onSuccess: invalidateAll,
    });

    const updateThread = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ThreadItemData> }) =>
            inventoryService.updateThread(id, data),
        onSuccess: invalidateAll,
    });

    const deleteThread = useMutation({
        mutationFn: (id: string) => inventoryService.deleteThread(id),
        onSuccess: invalidateAll,
    });

    return { createThread, updateThread, deleteThread };
}

export function useGarmentMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-garments'] });
        queryClient.invalidateQueries({ queryKey: ['admin-garment-products'] });
        queryClient.invalidateQueries({ queryKey: ['active-garment-products'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
    };

    const createGarment = useMutation({
        mutationFn: (data: GarmentItemData) => inventoryService.createGarment(data),
        onSuccess: invalidateAll,
    });

    const updateGarment = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<GarmentItemData> }) =>
            inventoryService.updateGarment(id, data),
        onSuccess: invalidateAll,
    });

    const deleteGarment = useMutation({
        mutationFn: (id: string) => inventoryService.deleteGarment(id),
        onSuccess: invalidateAll,
    });

    return { createGarment, updateGarment, deleteGarment };
}

export function useCategoryMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
    };

    const createCategory = useMutation({
        mutationFn: (name: string) => inventoryService.createCategory(name),
        onSuccess: invalidateAll,
    });

    const deleteCategory = useMutation({
        mutationFn: (id: string) => inventoryService.deleteCategory(id),
        onSuccess: invalidateAll,
    });

    return { createCategory, deleteCategory };
}

export function useWarehouseMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-warehouses'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-garments'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-fabric'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-thread'] });
    };

    const createWarehouse = useMutation({
        mutationFn: (name: string) => inventoryService.createWarehouse(name),
        onSuccess: invalidateAll,
    });

    const deleteWarehouse = useMutation({
        mutationFn: (id: string) => inventoryService.deleteWarehouse(id),
        onSuccess: invalidateAll,
    });

    return { createWarehouse, deleteWarehouse };
}
