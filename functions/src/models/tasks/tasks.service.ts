import {
    getAllUserTasks as getAll,
    getTaskById as getById,
    addTask as add,
    updateTask as update,
    deleteTask as remove,
} from './data/tasks.repository.js';
import type { Task } from './interfaces/task.interface.js';

export const getAllUserTasks = async (userId: string): Promise<Task[]> => {
    try {
        return getAll(userId);
    } catch (error) {
        console.error(
            'service:getAllUserTasks:Error fetching all user tasks:',
            error,
        );
        throw error;
    }
};

export const getTaskById = async (
    id: string,
    userId: string,
): Promise<Task> => {
    try {
        const task = await getById(id);
        validateUserAccess(userId, task.userId!!);
        delete task.userId; // Remove userId before returning
        return task;
    } catch (error) {
        console.error('service:getTaskById:Error fetching task by ID:', error);
        throw error;
    }
};

export const createTask = async (task: Task): Promise<Task> => {
    try {
        const createdTask = await add(task);
        delete createdTask.userId; // Remove userId before returning
        return createdTask;
    } catch (error) {
        console.error('service:createTask:Error creating task:', error);
        throw error;
    }
};

export const updateTask = async (
    id: string,
    task: Partial<Task>,
): Promise<Task> => {
    try {
        const existingTask = await getById(id);
        validateUserAccess(task.userId!!, existingTask.userId!!);
        const updatedTask = await update(id, task);
        delete updatedTask.userId;
        return updatedTask;
    } catch (error) {
        console.error('service:updateTask:Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (id: string, userId: string): Promise<Task> => {
    try {
        const existingTask = await getById(id);
        validateUserAccess(userId, existingTask.userId!!);
        await remove(id);
        delete existingTask.userId; // Remove userId before returning
        return existingTask;
    } catch (error) {
        console.error('service:deleteTask:Error deleting task:', error);
        throw error;
    }
};

const validateUserAccess = (
    requestUserId: string,
    originalTaskUserId: string,
) => {
    if (originalTaskUserId !== requestUserId) {
        throw new Error('Unauthorized access to task');
    }
};
