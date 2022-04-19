import combineIrregularVerbs from './combineIrregularVerbs';
import getWordsByFrequency from './getWordsByFrequency';

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

export default function getWordsSortedByFrequency(fileContent: string): Word[] {
  if (!fileContent || typeof fileContent !== 'string') return [];

  let wordsByFrequencyMap = getWordsByFrequency(fileContent);

  wordsByFrequencyMap = combineIrregularVerbs(wordsByFrequencyMap);

  const sortedArrayOfWords = sort(wordsByFrequencyMap);

  return sortedArrayOfWords.map((value) => ({
    value,
    count: wordsByFrequencyMap.get(value) ?? 1,
  }));
}
