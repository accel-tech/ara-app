import { FC, HTMLProps, useCallback, useEffect, useRef, useState } from "react";
import { cl } from "../utils/misc";

export const Dots: FC<
  { isAnimating: boolean; speed?: number } & HTMLProps<HTMLDivElement>
> = ({ isAnimating, speed = 500, className, ...props }) => {
  const [dots, setDots] = useState("");
  let timeout = useRef<number>().current;

  const changeDots = useCallback(() => {
    if (dots === "") setDots(".");
    if (dots === ".") setDots("..");
    if (dots === "..") setDots("...");
    if (dots === "...") setDots("");
  }, [dots]);

  function stopAnim() {
    setDots("");
    clearTimeout(timeout);
  }

  useEffect(() => {
    if (!isAnimating) stopAnim();
    return () => stopAnim();
  }, [isAnimating]);

  useEffect(() => {
    if (isAnimating) {
      timeout = setTimeout(changeDots, speed);
    }
  }, [dots, isAnimating]);
  return (
    <span className={cl("relative", className)} {...props}>
      <span className="opacity-0">...</span>
      <span className="left-0 absolute">{dots}</span>
    </span>
  );
};
