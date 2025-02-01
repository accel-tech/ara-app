import { Button, TextInput } from "@patternfly/react-core";
import {
  CheckIcon,
  MinusIcon,
  PenIcon,
  TimesIcon,
  TrashIcon,
} from "@patternfly/react-icons";
import { FC, Fragment, useEffect, useState } from "react";

export const InlineEditTextInput: FC<{
  actualValue: string;
  onSave: (newValue: string) => void;
  isDisabled?: boolean;
  isEditable?: boolean;
  isDeletable?: boolean;
  onDelete?: () => void;
}> = ({
  actualValue,
  onSave,
  isDisabled,
  isEditable = true,
  isDeletable = false,
  onDelete,
}) => {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"view" | "edit">("view");

  function handleSave() {
    onSave(value);
    setState("view");
  }

  function handleCancel() {
    setState("view");
    setValue(actualValue);
  }

  useEffect(() => {
    setValue(actualValue);
  }, [actualValue]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "max-content",
        alignItems: "center",
      }}
    >
      {state === "edit" && (
        <Fragment>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
          <Button
            icon={<CheckIcon />}
            variant="plain"
            size="sm"
            onClick={handleSave}
          ></Button>
          <Button
            icon={<TimesIcon />}
            variant="plain"
            size="sm"
            onClick={handleCancel}
          ></Button>
          {isDeletable && (
            <Button
              size="sm"
              variant="link"
              icon={<TrashIcon />}
              onClick={onDelete}
              isDanger
            />
          )}
        </Fragment>
      )}
      {state === "view" && (
        <Fragment>
          <p style={{ marginRight: 10 }}>{actualValue}</p>
          {isEditable && (
            <Button
              icon={<PenIcon />}
              variant="plain"
              size="sm"
              onClick={() => setState("edit")}
              isDisabled={isDisabled}
            ></Button>
          )}
        </Fragment>
      )}
    </div>
  );
};
