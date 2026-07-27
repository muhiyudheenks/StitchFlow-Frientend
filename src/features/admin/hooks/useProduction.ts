import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productionService, CreateBatchPayload, UpdateBatchTeamPayload, BatchTaskData } from '../services/production-service';

export function useProductionBatches() {
    return useQuery({
        queryKey: ['production-batches'],
        queryFn: () => productionService.getBatches(),
    });
}

export function useBatchTasks(batchId: string) {
    return useQuery({
        queryKey: ['batch-tasks', batchId],
        queryFn: () => productionService.getBatchTasks(batchId),
        enabled: Boolean(batchId),
    });
}

export function useProductionMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['production-batches'] });
        queryClient.invalidateQueries({ queryKey: ['batch-tasks'] });
    };

    const createBatch = useMutation({
        mutationFn: (data: CreateBatchPayload) => productionService.createBatch(data),
        onSuccess: invalidateAll,
    });

    const updateBatch = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateBatchPayload & { status: string }> }) =>
            productionService.updateBatch(id, data),
        onSuccess: invalidateAll,
    });

    const updateBatchTeam = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBatchTeamPayload }) =>
            productionService.updateBatchTeam(id, data),
        onSuccess: invalidateAll,
    });

    const createBatchTask = useMutation({
        mutationFn: ({ batchId, data }: { batchId: string; data: Partial<BatchTaskData> }) =>
            productionService.createBatchTask(batchId, data),
        onSuccess: invalidateAll,
    });

    const updateBatchTask = useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: Partial<BatchTaskData> }) =>
            productionService.updateBatchTask(taskId, data),
        onSuccess: invalidateAll,
    });

    const deleteBatchTask = useMutation({
        mutationFn: (taskId: string) => productionService.deleteBatchTask(taskId),
        onSuccess: invalidateAll,
    });

    return { createBatch, updateBatch, updateBatchTeam, createBatchTask, updateBatchTask, deleteBatchTask };
}
