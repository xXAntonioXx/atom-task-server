import { db } from '../../../firebase.js';
import type { Task } from '../interfaces/task.interface.js';
import { serializeTask } from '../serializers/tasks.serializer.js';
import {
    firestoreDocBelongsToUser,
    firestoreDocExists,
} from '../../../utils/firestore-doc.utils.js';

export const getAllUserTasks = async (userId: string): Promise<Task[]> => {
    const snapshot = await db
        .collection('tasks')
        .where('userId', '==', userId)
        .get();
    const tasks = snapshot.docs.map((doc) => serializeTask(doc));
    return tasks;
};

export const getTaskById = async (
    id: string,
    userId: string,
): Promise<Task> => {
    const snapshot = await db.collection('tasks').doc(id).get();
    firestoreDocExists(snapshot);
    firestoreDocBelongsToUser(snapshot, userId);
    return serializeTask(snapshot);
};

export const addTask = async (task: Task): Promise<Task> => {
    const createdTask = await db
        .collection('tasks')
        .add({ ...task, createdAt: new Date(task.createdAt) });
    return getTaskById(createdTask.id, task.userId!!);
};

export const updateTask = async (
    id: string,
    task: Partial<Task>,
): Promise<Task> => {
    try {
        const docRef = db.collection('tasks').doc(id);
        const docSnap = await docRef.get();

        firestoreDocExists(docSnap);
        firestoreDocBelongsToUser(docSnap, task.userId!!);

        const originalTask = serializeTask(docSnap);
        const taskChanges = {
            ...originalTask,
            ...task,
        } as Task;
        if (taskChanges.id) delete taskChanges.id; // ID should not be updated
        if (taskChanges.userId) delete taskChanges.userId; // userId should not be updated
        await docRef.update({
            ...taskChanges,
            createdAt: new Date(originalTask.createdAt),
        });
        return { ...taskChanges, id: id } as Task;
    } catch (error) {
        console.error('repository:updateTask:Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (id: string, userId: string): Promise<Task> => {
    try {
        const docRef = db.collection('tasks').doc(id);
        const docSnap = await docRef.get();

        firestoreDocExists(docSnap);
        firestoreDocBelongsToUser(docSnap, userId);

        await docRef.delete();
        return serializeTask(docSnap);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};
