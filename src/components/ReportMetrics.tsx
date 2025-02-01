import { FC } from "react";
import { Report } from "../types/report";
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { InlineEditTextInput } from "./InlineEditTextInput";

const keyInfoMap: Record<
  keyof Report["metrics"],
  { label: string; info?: string; unit?: string }
> = {
  origins_cpu: { label: "Origins CPU usage", info: "" },
  origins_memory: { label: "Origins Memory usage", info: "" },
};
export const ReportMetrics: FC<{
  status: Report["status"];
  metrics: Report["metrics"];
}> = ({ status, metrics }) => {
  if (status === "draft") {
    return (
      <Form isHorizontal style={{ rowGap: 5 }}>
        {Object.keys(metrics).map((key: any) => (
          <FormGroup
            key={key}
            label={keyInfoMap[key as keyof Report["metrics"]].label || "-"}
            hasNoPaddingTop
            style={{ alignItems: "center" }}
          >
            <InlineEditTextInput
              actualValue={metrics[key as keyof Report["metrics"]] + ""}
              onSave={() => {}}
            />
          </FormGroup>
        ))}
      </Form>
      // <DescriptionList isCompact isHorizontal isFluid style={{ rowGap: 5 }}>
      // {Object.keys(metrics).map((key: any) => (
      //   <DescriptionListGroup key={key}>
      //     <DescriptionListTerm>
      //       {keyInfoMap[key as keyof Report["metrics"]].label || "-"}
      //     </DescriptionListTerm>
      //     <DescriptionListDescription>
      //       {metrics[key as keyof Report["metrics"]]}
      //     </DescriptionListDescription>
      //   </DescriptionListGroup>
      // ))}
      // </DescriptionList>
    );
  }
  if (status === "published") {
    return (
      <div>
        <p>form to update</p>
      </div>
    );
  }

  return <></>;
};
