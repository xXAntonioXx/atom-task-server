export const firestoreDocExists = (docSnap: any) => {
    if (!docSnap.exists) {
        throw new Error('Task not found');
    }
};

export const firestoreDocBelongsToUser = (docSnap: any, userId: string) => {
    const data = docSnap.data();
    if (data.userId !== userId) {
        throw new Error('Unauthorized access to the document');
    }
};
