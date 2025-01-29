import { FC, HTMLProps, useCallback, useEffect, useRef, useState } from "react";
import { cl } from "../utils/misc";

export const Dots: FC<
  { isAnimating: boolean; speed?: number } & HTMLProps<HTMLDivElement>
> = ({ isAnimating, speed = 500, ...props }) => {
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
    <span style={{ position: "relative" }} {...props}>
      <span style={{ opacity: 0 }}>...</span>
      <span style={{ position: "absolute", left: 0 }}>{dots}</span>
    </span>
  );
};
