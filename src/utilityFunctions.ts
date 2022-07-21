export function generateID(length: number) {
    // Generates a base62 string of length [length] to identify dishes.
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    var charactersLength = CHARACTERS.length;
    for (var i = 0; i < length; i++) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function generateUniqueID(length: number, existingIds: string[]) {
    let id = null;
    let notUnique = true;
    do {
        id = generateID(length);
        if (!existingIds.includes(id)) {
            notUnique = false;
        };
    } while (notUnique);
    return id;
}

export function shuffleArray(arr: any[]) {
    // Returns a shuffled array.
    let shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}