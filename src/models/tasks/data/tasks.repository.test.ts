import type { Task } from '../interfaces/task.interface';
import {
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    getAllTasks,
} from './tasks.repository';
const firstTask: Task = {
    id: '1',
    title: 'First Task',
    description: 'This is the first task',
    completed: false,
};

const secondTask: Task = {
    id: '2',
    title: 'Second Task',
    completed: true,
};

describe('Task Data Layer', () => {
    beforeEach(() => {
        addTask(firstTask);
        addTask(secondTask);
    });

    afterEach(() => {
        // Clear tasks array
        const allTasks: Task[] = getAllTasks();
        for (const task of allTasks) {
            deleteTask(task.id);
        }
    });

    test('Add a new task', () => {
        const addTestTask: Task = {
            id: 'test1',
            title: 'Test Task',
            description: 'This is a test task',
            completed: false,
        };
        addTask(addTestTask);
        const task = getTaskById(addTestTask.id);
        expect(task).toEqual(addTestTask);
    });

    test('Update an existing task', () => {
        const firstTaskToUpdate = {
            ...firstTask,
            title: 'Updated First Task',
            completed: true,
        };
        const updatedTask = updateTask(firstTask.id, firstTaskToUpdate);
        expect(updatedTask).toEqual(firstTaskToUpdate);
    });

    test('Delete a task', () => {
        const deleteResult = deleteTask(firstTask.id);
        expect(deleteResult).toBe(true);
        const task = getTaskById(firstTask.id);
        expect(task).toBeUndefined();
    });

    test('Get task by ID', () => {
        const task = getTaskById(secondTask.id);
        expect(task).toEqual(secondTask);
    });

    test('Get all tasks', () => {
        const allTasks = getAllTasks();
        expect(allTasks).toEqual([firstTask, secondTask]);
    });
});
