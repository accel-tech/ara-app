import { Button, TextInput } from "@patternfly/react-core";
import { CheckIcon, PenIcon, TimesIcon } from "@patternfly/react-icons";
import { FC, Fragment, useEffect, useState } from "react";

export const InlineEditTextInput: FC<{
  actualValue: string;
  onSave: (newValue: string) => void;
  isDisabled?: boolean;
  isEditable?: boolean;
}> = ({ actualValue, onSave, isDisabled, isEditable = true }) => {
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
            ></Button>
          )}
        </Fragment>
      )}
    </div>
  );
};
