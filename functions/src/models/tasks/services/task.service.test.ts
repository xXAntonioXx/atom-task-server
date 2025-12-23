import { Task } from '../interfaces/task.interface';
import * as TaskService from './tasks.service';

let fakeDB: Task[] = [];
jest.mock('../data/tasks.repository', () => ({
    getAllUserTasks: jest.fn(async (userId: string) => {
        return fakeDB.filter((task) => task.userId === userId);
    }),
    getTaskById: jest.fn(async (id: string) => {
        if (id === 'nonexistent-task') throw new Error('Task not found');
        return fakeDB.find((task) => task.id === id);
    }),
    addTask: jest.fn(async (task) => {
        fakeDB.push(task);
        return task;
    }),
    updateTask: jest.fn(async (id: string, updatedTask) => {
        const index = fakeDB.findIndex((task) => task.id === id);
        if (index !== -1) {
            fakeDB[index] = { ...fakeDB[index], ...updatedTask };
            return fakeDB[index];
        }
        throw new Error('Task not found');
    }),
    deleteTask: jest.fn(async () => {
        const index = fakeDB.findIndex((task) => task.id === 'task-101');
        if (index == -1) {
            throw new Error('Task not found');
        }
        const [deletedTask] = fakeDB.splice(index, 1);
        return deletedTask;
    }),
}));
jest.spyOn(TaskService, 'validateUserAccess').mockImplementation(
    (userId, taskUserId) => {
        if (userId !== taskUserId) {
            throw new Error('Unauthorized access to task');
        }
    },
);
console.error = jest.fn();

describe('tasks.service layer', () => {
    beforeEach(() => {
        fakeDB = [
            {
                id: 'task-101',
                title: 'Complete Jest Timeout Research',
                description:
                    'Look into the different methods for adjusting default test timeouts in Jest configuration.',
                completed: false,
                createdAt: new Date('2025-12-10T10:00:00Z'),
                userId: 'user-a1b2',
            },
            {
                id: 'task-102',
                title: 'Review PR for New Feature',
                completed: true,
                createdAt: new Date('2025-12-09T14:30:00Z'),
                userId: 'user-a1b2',
            },
            {
                id: 'task-103',
                title: 'Schedule Team Standup',
                description:
                    'Find a suitable time slot for the daily team synchronization meeting tomorrow morning.',
                completed: false,
                createdAt: new Date('2025-12-15T09:45:00Z'),
                userId: 'user-c3d4',
            },
        ];
    });
    test('getAllUserTasks should return tasks related to user', async () => {
        const tasks = await TaskService.getAllUserTasks('user-a1b2');
        expect(tasks).toEqual([
            {
                id: 'task-101',
                title: 'Complete Jest Timeout Research',
                description:
                    'Look into the different methods for adjusting default test timeouts in Jest configuration.',
                completed: false,
                createdAt: new Date('2025-12-10T10:00:00Z'),
                userId: 'user-a1b2',
            },
            {
                id: 'task-102',
                title: 'Review PR for New Feature',
                completed: true,
                createdAt: new Date('2025-12-09T14:30:00Z'),
                userId: 'user-a1b2',
            },
        ]);
    });
    test('getAllUserTasks should return empty array if no tasks for user', async () => {
        const tasks = await TaskService.getAllUserTasks('user-xyz');
        expect(tasks).toEqual([]);
    });
    test('getTaskById should return a task if is related to a user', async () => {
        const task = await TaskService.getTaskById('task-101', 'user-a1b2');
        expect(task).toEqual({
            id: 'task-101',
            title: 'Complete Jest Timeout Research',
            description:
                'Look into the different methods for adjusting default test timeouts in Jest configuration.',
            completed: false,
            createdAt: new Date('2025-12-10T10:00:00Z'),
        });
    });
    test('getTaskById should throw error if task is not related to user', async () => {
        expect(
            TaskService.getTaskById('task-103', 'user-a1b2'),
        ).rejects.toThrow(new Error('Unauthorized access to task'));
    });
    test('getTaskById should throw error if task does not exist', async () => {
        expect(
            TaskService.getTaskById('nonexistent-task', 'user-a1b2'),
        ).rejects.toThrow(new Error('Task not found'));
    });
    test('createTask should add a new task and return it without userId', async () => {
        const newTask = {
            id: 'task-104',
            title: 'Schedule Team Standup',
            description:
                'Find a suitable time slot for the daily team synchronization meeting tomorrow morning.',
            completed: false,
            createdAt: new Date('2025-12-15T09:45:00Z'),
            userId: 'user-c3d4',
        };
        const createdTask = await TaskService.createTask(newTask);
        expect(createdTask).toEqual({
            id: 'task-104',
            title: 'Schedule Team Standup',
            description:
                'Find a suitable time slot for the daily team synchronization meeting tomorrow morning.',
            completed: false,
            createdAt: new Date('2025-12-15T09:45:00Z'),
        });
    });
    test('updateTask should update an existing task if related to user', async () => {
        const taskToUpdate = {
            ...fakeDB[0],
            id: 'task-101',
            title: 'Schedule Team Standup(edited)',
            description:
                'Find a suitable time slot for the daily team synchronization meeting tomorrow morning.(edited)',
            completed: true,
        };
        const updatedTask = await TaskService.updateTask(
            taskToUpdate.id,
            taskToUpdate,
        );
        expect(updatedTask).toEqual(fakeDB[0]);
    });
    test('updateTask should throw error if task to update is not related to user', async () => {
        const taskToUpdate = {
            ...fakeDB[0],
            id: 'task-101',
            title: 'Schedule Team Standup(edited)',
            description:
                'Find a suitable time slot for the daily team synchronization meeting tomorrow morning.(edited)',
            completed: true,
            userId: 'user-unauthorized',
        };
        expect(
            TaskService.updateTask(taskToUpdate.id, taskToUpdate),
        ).rejects.toThrow(new Error('Unauthorized access to task'));
    });
    test('deleteTask should delete an existing task if related to user', async () => {
        const deletedTask = await TaskService.deleteTask(
            'task-101',
            'user-a1b2',
        );
        expect(deletedTask).toEqual({
            id: 'task-101',
            title: 'Complete Jest Timeout Research',
            description:
                'Look into the different methods for adjusting default test timeouts in Jest configuration.',
            completed: false,
            createdAt: new Date('2025-12-10T10:00:00Z'),
        });
        expect(fakeDB.find((task) => task.id === 'task-101')).toBeUndefined();
    });
    test('deleteTask should throw error if task to delete is not related to user', async () => {
        expect(
            TaskService.deleteTask('task-101', 'user-unauthorized'),
        ).rejects.toThrow(new Error('Unauthorized access to task'));
    });
});
