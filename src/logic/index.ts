import combineIrregularVerbs from './combineIrregularVerbs';
import getWordsByFrequency from './getWordsByFrequency';
import getFileText from './getFileText';

interface Word {
  value: string;
  count: number;
}

const sort = (wordsByFrequencyMap: Map<string, number>) => {
  return [...wordsByFrequencyMap.keys()].sort(
    (a, b) =>
      (wordsByFrequencyMap.get(b) || 0) - (wordsByFrequencyMap.get(a) || 0)
  );
};

export default async function getWordsSortedByFrequency(
  fileContent: Buffer,
  fileName: string
): Promise<Word[]> {
  const fileText = await getFileText(fileContent, fileName);

  if (!fileText || typeof fileText !== 'string') return [];

  let wordsByFrequencyMap = getWordsByFrequency(fileText);

  wordsByFrequencyMap = combineIrregularVerbs(wordsByFrequencyMap);

  const sortedArrayOfWords = sort(wordsByFrequencyMap);

  return sortedArrayOfWords.map((value) => ({
    value,
    count: wordsByFrequencyMap.get(value) ?? 1,
  }));
}
