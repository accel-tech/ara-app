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

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function departmentToUrl(props: { category: string; title: string }) {
  return (
    "/" +
    urlizeString(props.category) +
    "/" +
    urlizeString(props.title.toLowerCase())
  );
}

export function urlizeString(str: string) {
  return str.toLowerCase().replace(/\s/g, "-");
}
export function unUrlizeString(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

// export function urlToDepartment(url: string) {
//   const parts = url.split("/");
//   const category = parts.length > 1 ? parts[1].replace(/-/g, " ") : "";
//   const title = parts.length > 2 ? parts[2].replace(/-/g, " ") : "";
//   return {
//     category,
//     title,
//   };
// }

export function dateToWeekRange(date: Date): {
  startOfWeek: Date;
  endOfWeek: Date;
} {
  const startOfWeek = new Date(date);
  const endOfWeek = new Date(date);

  const dayOfWeek = startOfWeek.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  endOfWeek.setDate(endOfWeek.getDate() + diffToMonday + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startOfWeek,
    endOfWeek,
  };
}

export function fmtDate1(date: Date, month?: "short" | "long") {
  const options: Intl.DateTimeFormatOptions = {
    month: month || "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date); // format to Jan. 29
}
