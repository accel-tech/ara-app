import {
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
import { useFetch } from "../hooks/useFetch";
import { TimesIcon } from "@patternfly/react-icons";
import { Certification } from "../types/certification";
import { fmtDate1 } from "../utils/misc";

export const CertificationSelect: FC<{
  departmentId: string;
  value: string;
  onValueChange: (val: string) => void;
  isDisabled?: boolean;
  excludeOptionIds?: string[];
}> = ({ value, onValueChange, isDisabled, departmentId, excludeOptionIds }) => {
  const [options, setOptions] = useState<
    Array<{
      _id: string;
      title: string;
      employeeName: string;
      examCode?: string;
      status: string;
      dateProjected?: Date;
      dateCompleted?: Date;
    }>
  >([]);
  const [isLoading, setLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const httpRequest = useFetch();

  const textInputRef = useRef<HTMLInputElement>();

  // const selectedEmployee = options.find((opt) => opt._id === value);

  async function fetchProjects() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await httpRequest<Certification[]>(
      `/certifications?departmentId=${departmentId}` // only relevant
    );
    setLoading(false);
    if (error) {
      console.log(error, "Failed to get department certifications");
      setError(error.message);
      return;
    }
    if (data && Object.keys(data).length > 0) {
      setOptions(
        data.map((dt) => ({
          _id: dt._id,
          title: dt.title,
          employeeName: dt.employee.name,
          examCode: dt.examCode,
          status: dt.status,
          dateProjected: dt.dateProjected,
          // @ts-ignore
          dateCompleted: dt.dateCompleted,
        }))
      );
    }
  }
  useEffect(() => {
    fetchProjects();
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
    setFilterValue(options.find((opt) => opt._id === value)?.title || "");
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
          variant="typeahead"
        >
          {isLoading ? (
            <TextInputGroup isPlain>
              <TextInputGroupMain value="Loading..." />
            </TextInputGroup>
          ) : (
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
                placeholder="Select Certification"
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
          if (excludeOptionIds && excludeOptionIds.includes(opt._id)) {
            return false;
          }
          if (filterValue) return opt.title.includes(filterValue);
          return true;
        })
        .map((opt) => (
          <SelectOption
            value={opt._id}
            key={opt._id}
            description={
              opt.employeeName +
              (opt.status === "completed"
                ? ` - Completed on ${fmtDate1(opt.dateCompleted!)}`
                : ` - Projected for ${
                    opt.dateProjected ? fmtDate1(opt.dateProjected) : "NA"
                  }`)
            }
            isDisabled={isLoading || isDisabled}
          >
            {opt.title + (opt.examCode ? ` (${opt.examCode})` : "")}
          </SelectOption>
        ))}
    </Select>
  );
};
