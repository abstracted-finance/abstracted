export const partialSearchHandler = (allOptions, setInputOptions) => (
  currentValue
) => {
  if (!currentValue) return setInputOptions(allOptions);
  const relatedOptions = allOptions.filter((item) =>
    item.value.toLowerCase().includes(currentValue.toLowerCase())
  );
  setInputOptions(relatedOptions);
};
