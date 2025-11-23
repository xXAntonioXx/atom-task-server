import { db } from '../../../firebase.js';
import type { Task } from '../interfaces/task.interface.js';
import { serializeTask } from '../serializers/tasks.serializer.js';
import { firestoreDocExists } from '../../../shared/utils/firestore-doc.utils.js';

export const getAllUserTasks = async (userId: string): Promise<Task[]> => {
    const snapshot = await db
        .collection('tasks')
        .where('userId', '==', userId)
        .get();

    const tasks = snapshot.docs.map((doc) => {
        const serializedTask = serializeTask(doc);
        delete serializedTask.userId;
        return serializedTask;
    });
    return tasks;
};

export const getTaskById = async (id: string): Promise<Task> => {
    const snapshot = await db.collection('tasks').doc(id).get();

    firestoreDocExists(snapshot);

    return serializeTask(snapshot);
};

export const addTask = async (task: Task): Promise<Task> => {
    const createdTask = await db
        .collection('tasks')
        .add({ ...task, createdAt: new Date(task.createdAt) });

    return getTaskById(createdTask.id);
};

export const updateTask = async (
    id: string,
    task: Partial<Task>,
): Promise<Task> => {
    try {
        const originalTask = await getTaskById(id);
        const taskChanges = {
            ...originalTask,
            ...task,
        } as Task;
        if (taskChanges.id) delete taskChanges.id; // ID should not be updated
        await db
            .collection('tasks')
            .doc(id)
            .update({
                ...taskChanges,
                createdAt: new Date(originalTask.createdAt),
            });
        return { ...taskChanges, id: id } as Task;
    } catch (error) {
        console.error('repository:updateTask:Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (id: string): Promise<Task> => {
    try {
        const taskDeleted = await getTaskById(id); // to check existence
        await db.collection('tasks').doc(id).delete();
        return taskDeleted;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};
