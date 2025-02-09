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
  styled?: boolean;
}> = ({
  actualValue,
  onSave,
  isDisabled,
  isEditable = true,
  isDeletable = false,
  onDelete,
  styled = true,
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
        display: styled ? "flex" : "inline-flex",
        width: styled ? undefined : "max-content",
        alignItems: "center",
        flex: 1,
      }}
    >
      {state === "edit" && (
        <Fragment>
          {styled ? (
            <TextInput
              value={value}
              onChange={(_e, value) => setValue(value)}
              autoFocus
            />
          ) : (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          )}
          <Button
            icon={<CheckIcon />}
            variant="plain"
            size={styled ? "default" : "sm"}
            onClick={handleSave}
          ></Button>
          <Button
            icon={<TimesIcon />}
            variant="plain"
            size={styled ? "default" : "sm"}
            onClick={handleCancel}
          ></Button>
          {isDeletable && (
            <Button
              size={styled ? "default" : "sm"}
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
