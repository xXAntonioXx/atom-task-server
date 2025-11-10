export const firestoreDocExists = (docSnap: any) => {
    if (!docSnap.exists) {
        throw new Error('Task not found');
    }
};
