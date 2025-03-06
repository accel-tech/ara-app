import { BugIcon } from "@patternfly/react-icons";

export const DataError = () => {
  return (
    <div className="flex-1 flex items-center justify-start text-red-800 gap-[5px]">
      <BugIcon />
      <p>data error.</p>
    </div>
  );
};
