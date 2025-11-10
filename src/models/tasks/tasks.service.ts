import {
    getAllUserTasks as getAll,
    getTaskById as getById,
    addTask as add,
    updateTask as update,
    deleteTask as remove,
} from './data/tasks.repository.js';
import type { Task } from './interfaces/task.interface';

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
        return getById(id, userId);
    } catch (error) {
        console.error('service:getTaskById:Error fetching task by ID:', error);
        throw error;
    }
};

export const createTask = async (task: Task): Promise<Task> => {
    try {
        return add(task);
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
        return update(id, task);
    } catch (error) {
        console.error('service:updateTask:Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (id: string, userId: string): Promise<Task> => {
    try {
        return remove(id, userId);
    } catch (error) {
        console.error('service:deleteTask:Error deleting task:', error);
        throw error;
    }
};
