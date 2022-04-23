import alphabeth from './alphabeth';

export default function getWordsByFrequency(
  fileText: string
): Map<string, number> {
  const lowerCaseText = fileText.toLowerCase();
  const allWords = [];
  let currentWord = '';
  for (let char of lowerCaseText) {
    if (alphabeth.has(char)) {
      currentWord += char;
    } else {
      if (
        currentWord.length > 1 &&
        currentWord.length < 15 &&
        !parseInt(currentWord)
      ) {
        allWords.push(currentWord);
      }

      currentWord = '';
    }
  }

  const wordsByFrequencyMap = new Map<string, number>();
  allWords.forEach((word) => {
    const wordFrequency = wordsByFrequencyMap.get(word) ?? 0;
    wordsByFrequencyMap.set(word, wordFrequency + 1);
  });

  return wordsByFrequencyMap;
}
