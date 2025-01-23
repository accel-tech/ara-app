export const cl = (
  ...classNames: Array<string | { [key: string]: boolean } | undefined>
): string => {
  return classNames
    .map((className) => {
      if (typeof className === "undefined") return undefined;
      if (typeof className === "string") return className;

      const [key, condition] = Object.entries(className)[0];
      if (!condition) return undefined;

      return key;
    })
    .filter((val) => val)
    .join(" ");
};

export function concatWithoutDuplicates<T extends { _id: string }>(
  baseArray: T[],
  newDocs: T[]
) {
  const newArray = [...baseArray];

  newDocs.forEach((el) => {
    const index = newArray.findIndex((doc) => doc._id === el._id);
    if (index === -1) newArray.push(el);
    // replace old
    else newArray[index] = el;
  });

  return newArray;
}
