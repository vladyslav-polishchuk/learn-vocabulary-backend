import type { UploadedFile } from 'express-fileupload';

interface Word {
  value: string;
  frequency: number;
}

const alphabeth = new Set([
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '-',
  "'",
]);

export default function getWordsByFrequency(file: UploadedFile): Word[] {
  const fileContent = file.data.toString();

  if (!fileContent || typeof fileContent !== 'string') return [];

  const lowerCaseText = fileContent.toLowerCase();
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

  const result = [...wordsByFrequencyMap.keys()].sort(
    (a, b) =>
      (wordsByFrequencyMap.get(b) || 0) - (wordsByFrequencyMap.get(a) || 0)
  );

  return result.map((value) => ({
    value,
    frequency: wordsByFrequencyMap.get(value) ?? 1,
  }));
}
