import type { Task } from '../interfaces/task.interface.js';

export const serializeTask = (doc: any): Task => {
    const docData = doc.data();
    return {
        id: doc.id,
        title: docData.title,
        description: docData.description,
        completed: docData.completed,
        createdAt: docData.createdAt.toDate(),
        userId: docData.userId,
    } as Task;
};
