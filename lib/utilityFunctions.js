export function generateID(length) {
  // Generates a base62 string of length to identify different objects.
  const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  var charactersLength = CHARACTERS.length;

  for (var i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export function generateUniqueID(length, existingIds) {
  if (62 ** length <= existingIds.length) {
    throw "An id length of ".concat(length, " can not generate more than ").concat(62 ** length, " unique ids.");
  }

  let id = null;
  let notUnique = true;

  do {
    id = generateID(length);

    if (!existingIds.includes(id)) {
      notUnique = false;
    }

    ;
  } while (notUnique);

  return id;
}
export function shuffleArray(arr) {
  // Returns a shuffled array.
  let shuffledArray = arr.slice();

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}