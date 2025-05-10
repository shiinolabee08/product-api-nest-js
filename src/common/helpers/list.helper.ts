export default function getDiffListById(currentList, newList) {
  const current = (currentList || [])
    .filter((item) => item.id != null)
    .map((item) => item.id);

  if (newList && newList.length) {
    const filtered = newList.filter((item) => {
      return !current.includes(item.id);
    });

    return filtered;
  }

  return null;
}
