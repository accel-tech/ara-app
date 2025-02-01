import { FC, useState } from "react";
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
import { useFetch } from "../hooks/useFetch";
import { typedUseStoreActions } from "../store";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";

const keyInfoMap: Record<
  keyof Report["metrics"],
  { label: string; info?: string; unit?: string }
> = {
  origins_cpu: { label: "Origins CPU usage", info: "" },
  origins_memory: { label: "Origins Memory usage", info: "" },
};
export const ReportMetrics: FC<{
  reportId: string;
  departmentId: string;
  status: Report["status"];
  metrics: Report["metrics"];
}> = ({ status, metrics, reportId, departmentId }) => {
  const [isLoading, setLoading] = useState(false);
  const access = useDepartmentAccess(departmentId);

  const patchDocument = typedUseStoreActions(
    (actions) => actions.reports.patchDocument
  );

  const httpRequest = useFetch();

  async function patchMetrics(patch: Partial<Report["metrics"]>) {
    if (isLoading) return;

    patchDocument({
      _id: reportId,
      fields: {
        metrics: { ...metrics, ...patch },
      },
    });
    setLoading(true);
    const { error } = await httpRequest(`/reports/${reportId}/metrics`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    setLoading(false);
    if (error) {
      console.log(error);
      // showToast();

      patchDocument({
        _id: reportId,
        fields: {
          metrics, // value is the same on function execution,
        },
      });
    }
  }

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
              isDisabled={access !== "lead" || isLoading}
              onSave={(newValue) => patchMetrics({ [key]: newValue })} // validation
            />
          </FormGroup>
        ))}
      </Form>
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
