import { Task } from '../interfaces/task.interface';
import * as TaskRepository from './tasks.repository';

console.error = jest.fn();
let fakeDB: Task[] = [];
jest.mock('../../../firebase', () => {
    return {
        db: {
            collection: jest.fn().mockImplementation(() => {
                return {
                    where: jest
                        .fn()
                        .mockImplementation(
                            (field: string, op: string, value: string) => {
                                return {
                                    orderBy: jest.fn().mockReturnThis(),
                                    get: jest.fn().mockResolvedValue({
                                        docs: fakeDB.filter(
                                            (task) => task.userId === value,
                                        ),
                                    }),
                                };
                            },
                        ),
                    doc: jest.fn().mockImplementation((id: string) => {
                        return {
                            get: jest
                                .fn()
                                .mockResolvedValue(
                                    fakeDB.find((task) => task.id === id) ||
                                        null,
                                ),
                            update: jest
                                .fn()
                                .mockImplementation((updates: any) => {
                                    const index = fakeDB.findIndex(
                                        (task) => task.id === id,
                                    );
                                    if (index === -1)
                                        throw new Error('Task not found');
                                    fakeDB[index] = {
                                        ...fakeDB[index],
                                        ...updates,
                                    };
                                    return Promise.resolve(fakeDB[index]);
                                }),
                            delete: jest.fn().mockImplementation(() => {
                                const index = fakeDB.findIndex(
                                    (task) => task.id === id,
                                );
                                if (index === -1)
                                    throw new Error('Task not found');
                                const [deletedTask] = fakeDB.splice(index, 1);
                                return Promise.resolve(deletedTask);
                            }),
                        };
                    }),
                    add: jest.fn().mockImplementation((task: any) => {
                        fakeDB.push(task);
                        return Promise.resolve(task);
                    }),
                };
            }),
        },
    };
});

jest.mock('../serializers/tasks.serializer', () => ({
    serializeTask: jest.fn().mockImplementation((doc: any) => {
        return {
            ...doc,
        };
    }),
}));

jest.mock('../../../shared/utils/firestore-doc.utils', () => ({
    firestoreDocExists: jest.fn().mockImplementation((doc: any) => {
        if (!doc) {
            throw new Error('Task not found');
        }
    }),
}));

describe('tasks.repository layer', () => {
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
    test('getAllUserTasks returns tasks for a specific user', async () => {
        const tasks = await TaskRepository.getAllUserTasks('user-a1b2');
        expect(tasks).toEqual([
            {
                id: 'task-101',
                title: 'Complete Jest Timeout Research',
                description:
                    'Look into the different methods for adjusting default test timeouts in Jest configuration.',
                completed: false,
                createdAt: new Date('2025-12-10T10:00:00Z'),
            },
            {
                id: 'task-102',
                title: 'Review PR for New Feature',
                completed: true,
                createdAt: new Date('2025-12-09T14:30:00Z'),
            },
        ]);
    });
    test('getAllUserTasks returns an empty array if user has no tasks', async () => {
        const tasks = await TaskRepository.getAllUserTasks('user-xyz');
        expect(tasks).toEqual([]);
    });
    test('getTaskById retrieves a task by its ID', async () => {
        const task = await TaskRepository.getTaskById('task-101');
        expect(task).toEqual({
            id: 'task-101',
            title: 'Complete Jest Timeout Research',
            description:
                'Look into the different methods for adjusting default test timeouts in Jest configuration.',
            completed: false,
            createdAt: new Date('2025-12-10T10:00:00Z'),
            userId: 'user-a1b2',
        });
    });
    test('getTaskById throws an error if task not found', async () => {
        await expect(
            TaskRepository.getTaskById('nonexistent-task'),
        ).rejects.toThrow('Task not found');
    });
    test('addTask creates a new task and returns it', async () => {
        const newTask = {
            id: 'task-104',
            title: 'Schedule Team Standup',
            description:
                'Find a suitable time slot for the daily team synchronization meeting tomorrow morning.',
            completed: false,
            createdAt: new Date('2025-12-15T09:45:00Z'),
            userId: 'user-c3d4',
        } as Task;
        const createdTask = await TaskRepository.addTask(newTask);
        const taskInArray = fakeDB.find((task) => task.id === 'task-104');
        expect(taskInArray).toEqual(newTask);
        expect(createdTask).toEqual(newTask);
    });
    test('updateTask updates an existing task and returns it', async () => {
        const taskToUpdate = {
            id: 'task-101',
            title: 'Complete Jest Timeout Research(updated)',
            description:
                'Look into the different methods for adjusting default test timeouts in Jest configuration.(updated)',
            completed: true,
        } as Partial<Task>;
        const updatedTask = await TaskRepository.updateTask(
            'task-101',
            taskToUpdate,
        );
        expect(updatedTask).toEqual({
            id: 'task-101',
            title: 'Complete Jest Timeout Research(updated)',
            description:
                'Look into the different methods for adjusting default test timeouts in Jest configuration.(updated)',
            completed: true,
            createdAt: new Date('2025-12-10T10:00:00Z'),
            userId: 'user-a1b2',
        });
        expect(fakeDB.find((task) => task.id === 'task-101')).toEqual({
            id: 'task-101',
            title: 'Complete Jest Timeout Research(updated)',
            description:
                'Look into the different methods for adjusting default test timeouts in Jest configuration.(updated)',
            completed: true,
            createdAt: new Date('2025-12-10T10:00:00Z'),
            userId: 'user-a1b2',
        });
    });
    test('updateTask throws an error if task to update does not exist', async () => {
        const taskToUpdate = {
            id: 'nonexistent-task',
            title: 'Nonexistent Task',
        };
        await expect(
            TaskRepository.updateTask('nonexistent-task', taskToUpdate),
        ).rejects.toThrow('Task not found');
    });
    test('deleteTask removes a task and returns it', async () => {
        const deletedTask = await TaskRepository.deleteTask('task-102');
        expect(deletedTask).toEqual({
            id: 'task-102',
            title: 'Review PR for New Feature',
            completed: true,
            createdAt: new Date('2025-12-09T14:30:00Z'),
            userId: 'user-a1b2',
        });
        expect(fakeDB.find((task) => task.id === 'task-102')).toBeUndefined();
    });
    test('deleteTask throws an error if task to delete does not exist', async () => {
        await expect(
            TaskRepository.deleteTask('nonexistent-task'),
        ).rejects.toThrow('Task not found');
    });
});
