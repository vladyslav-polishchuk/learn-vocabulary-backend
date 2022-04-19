import irregularVerbs from './irregularVerbs';

export default function combineIrregularVerbs(
  wordsByFrequencyMap: Map<string, number>
) {
  const secondAndThirdFormToFirstFormMap = new Map<string, string>();
  irregularVerbs.forEach(([first, second, third]) => {
    secondAndThirdFormToFirstFormMap.set(second, first);
    secondAndThirdFormToFirstFormMap.set(third, first);
  });

  for (const [
    secondOrThirdForm,
    firstForm,
  ] of secondAndThirdFormToFirstFormMap.entries()) {
    if (secondOrThirdForm === firstForm) continue;

    const secondOrThirdFormWord = wordsByFrequencyMap.get(secondOrThirdForm);
    if (!secondOrThirdFormWord) continue;

    const firstFormWord = wordsByFrequencyMap.get(firstForm) ?? 0;
    wordsByFrequencyMap.set(firstForm, firstFormWord + secondOrThirdFormWord);

    wordsByFrequencyMap.delete(secondOrThirdForm);
  }

  return wordsByFrequencyMap;
}
