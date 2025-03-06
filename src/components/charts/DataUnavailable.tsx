import { WarningTriangleIcon } from "@patternfly/react-icons";

export const DataUnavailable = () => {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-600 gap-[5px]">
      <WarningTriangleIcon />
      <p>data unavailable.</p>
    </div>
  );
};
