import type { Request, Response } from 'express';
import type { Task } from './interfaces/task.interface.js';
import {
    getAllUserTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from './tasks.service.js';

export const getAll = async (req: Request, res: Response) => {
    const tasks = await getAllUserTasks((req as any).user.uid!!);
    res.json(tasks);
};

export const get = async (req: Request, res: Response) => {
    try {
        const task = await getTaskById(
            req.params.id!!,
            (req as any).user.uid!!,
        );
        res.json(task);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    const newTask = { ...req.body, userId: (req as any).user.uid } as Task;
    const createdTask = await createTask(newTask);
    res.status(201).json(createdTask);
};

export const update = async (req: Request, res: Response) => {
    try {
        const taskToUpdate = {
            ...req.body,
            userId: (req as any).user.uid,
        } as Task;
        const task = await updateTask(req.params.id!!, taskToUpdate);
        res.json(task);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const task = await deleteTask(req.params.id!!, (req as any).user.uid!!);
        res.json(task);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
