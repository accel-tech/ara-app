import {
  Avatar,
  Button,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import { FC, useEffect, useRef, useState } from "react";
import imgAvatar from "@patternfly/react-core/src/components/assets/avatarImg.svg";
import { useFetch } from "../hooks/useFetch";
import { TimesIcon } from "@patternfly/react-icons";

export const EmployeeSelect: FC<{
  departmentId: string;
  value: string;
  onValueChange: (val: string) => void;
  isDisabled?: boolean;
}> = ({ value, onValueChange, isDisabled, departmentId }) => {
  const [options, setOptions] = useState<
    Array<{
      _id: string;
      name: string;
      email: string;
    }>
  >([]);
  const [isLoading, setLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const httpRequest = useFetch();

  const textInputRef = useRef<HTMLInputElement>();

  // const selectedEmployee = options.find((opt) => opt._id === value);

  async function fetchEmployees() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await httpRequest<
      { _id: string; name: string; email: string }[]
    >(`/departments/${departmentId}/members`);
    setLoading(false);
    if (error) {
      console.log(error, "Failed to get department members");
      setError(error.message);
      return;
    }
    if (data && Object.keys(data).length > 0) {
      setOptions(data);
    }
  }
  useEffect(() => {
    fetchEmployees();
  }, []);

  function onToggleClick() {
    setMenuOpen(!isMenuOpen);
    if (!isMenuOpen) textInputRef?.current?.focus();
  }

  function onSelect(
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) {
    onValueChange(value + "");
    setFilterValue(options.find((opt) => opt._id === value)?.name || "");
    setMenuOpen(false);
  }

  function onBlur() {
    // if (value) {
    //   setFilterValue(options.find((opt) => opt._id === value)?.name || "");
    // }
  }

  return (
    <Select
      isOpen={isMenuOpen}
      onSelect={onSelect}
      selected={value}
      onOpenChange={(isOpen: boolean) => setMenuOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          isFullWidth
          onClick={onToggleClick}
          isExpanded={isMenuOpen}
          isDisabled={isLoading || isDisabled}
          // variant="typeahead"

          icon={<Avatar size="sm" src={imgAvatar} alt="avatar" />}
        >
          {isLoading ? (
            "Loading..."
          ) : (
            // <span style={{ opacity: 0.5 }}>Select Employee</span>
            // <TextInput placeholder="Select Employee"  />
            <TextInputGroup isPlain>
              <TextInputGroupMain
                value={filterValue}
                onClick={() => {
                  if (!isMenuOpen) {
                    setMenuOpen(true);
                  } else if (!filterValue) {
                    setMenuOpen(false);
                  }
                }}
                onChange={(_e, value) => setFilterValue(value)}
                // onKeyDown={onInputKeyDown}
                id="typeahead-select-input"
                autoComplete="off"
                innerRef={textInputRef}
                placeholder="Select Employee"
                // {...(activeItemId && { 'aria-activedescendant': activeItemId })}
                role="combobox"
                isExpanded={isMenuOpen}
                aria-controls="select-typeahead-listbox"
                // style={{ outline: 0 }}
                onBlur={onBlur}
                disabled={isLoading || isDisabled}
              />

              <TextInputGroupUtilities
                {...(!filterValue ? { style: { display: "none" } } : {})}
              >
                <Button
                  variant="plain"
                  onClick={() => setFilterValue("")}
                  aria-label="Clear input value"
                  isDisabled={isLoading || isDisabled}
                  icon={<TimesIcon aria-hidden />}
                />
              </TextInputGroupUtilities>
            </TextInputGroup>
          )}
        </MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >
      {options
        .filter((opt) => {
          if (filterValue) return opt.name.includes(filterValue);
          return true;
        })
        .map((opt) => (
          <SelectOption
            value={opt._id}
            key={opt._id}
            description={opt.email}
            isDisabled={isLoading || isDisabled}
          >
            {opt.name}
          </SelectOption>
        ))}
    </Select>
  );
};
