import { FC, Fragment, useState } from "react";
import { Report } from "../types/report";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  Form,
  FormGroup,
  PageSection,
  Title,
  Tooltip,
} from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { InlineEditTextInput } from "./InlineEditTextInput";
import { useFetch } from "../hooks/useFetch";
import { typedUseStoreActions } from "../store";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";
import {
  downtimeToUptimePercent,
  fmtByteValue,
  getPercentage,
  getPercentOfNumber,
  metricKeyInfoMap,
} from "../utils/misc";
import { Dashboard } from "./charts/Dashboard";
import {
  ChartAxis,
  ChartBar,
  ChartBulletQualitativeRange,
  ChartLegend,
  ChartThemeColor,
  getTheme,
} from "@patternfly/react-charts/victory";

export const ReportMetrics: FC<{
  reportId: string;
  departmentId: string;
  status: Report["status"];
  coveringDates: Report["coveringDates"];
  metrics: Report["metrics"];
}> = ({ status, metrics, reportId, departmentId, coveringDates }) => {
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
        metrics: { ...metrics, data: { ...metrics.data, ...patch } },
      },
    });

    setLoading(true);
    const { error } = await httpRequest(`/metrics/${metrics._id}`, {
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
      <Form
        // isHorizontal
        onSubmit={(e) => e.preventDefault()}
      >
        {Object.keys(metrics.data).map((key: any) => (
          <FormGroup
            key={key}
            label={
              <>
                <span style={{ marginRight: 3 }}>
                  {metricKeyInfoMap[key as keyof Report["metrics"]["data"]]
                    .label || "-"}
                </span>{" "}
                (
                {metricKeyInfoMap[key as keyof Report["metrics"]["data"]]
                  .unit || "-"}
                )
                <Tooltip
                  content={
                    <span>
                      {metricKeyInfoMap[key as keyof Report["metrics"]["data"]]
                        .info || "-"}
                    </span>
                  }
                >
                  <Button icon={<InfoCircleIcon />} variant="plain" size="sm" />
                </Tooltip>
              </>
            }
            hasNoPaddingTop
            // style={{ alignItems: "center" }}
          >
            <InlineEditTextInput
              actualValue={
                metrics.data[key as keyof Report["metrics"]["data"]] + ""
              }
              isDisabled={access !== "lead" || isLoading}
              onSave={(newValue) => patchMetrics({ [key]: newValue })} // validation
            />
          </FormGroup>
        ))}
      </Form>
    );
  }
  if (status === "published") {
    const {
      origins_cpu_used,
      origins_cpu_available,
      origins_memory_used,
      origins_memory_available,
      origins_ceph_used,
      origins_ceph_available,
      origins_pods,
      origins_vms,
      origins_downtime,
      origins_outages,
      origins_mean_recovery_time,
      origins_node_status,
      origins_api_latency_internal,
      origins_ingress_latency_internal,
      origins_api_latency_external,
      origins_ingress_latency_external,
      originsl1_cpu_used,
      originsl1_cpu_available,
      originsl1_memory_used,
      originsl1_memory_available,
      originsl1_flashsystem_used,
      originsl1_flashsystem_available,
      originsl1_pods,
      originsl1_downtime,
      originsl1_outages,
      originsl1_mean_recovery_time,
      originsl1_node_status,
      originsl1_api_latency_internal,
      originsl1_ingress_latency_internal,
      originsl1_api_latency_external,
      originsl1_ingress_latency_external,
      ocp_cpu_used,
      ocp_cpu_available,
      ocp_memory_used,
      ocp_memory_available,
      ocp_ceph_used,
      ocp_ceph_available,
      ocp_pods,
      ocp_vms,
      ceph_storage_used,
      ceph_storage_available,
      flashsystem_storage_used,
      flashsystem_storage_available,
    } = metrics.data;
    return (
      <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
        <Dashboard
          title="Origins Platform"
          cardProps={{ id: "cloud-metrics-origins", isCompact: true }}
          components={[
            {
              span: 3,
              title: "Uptime",
              kind: "statcard",
              component: {
                value: `${downtimeToUptimePercent(
                  origins_downtime,
                  coveringDates
                )}`,
                unit: "%",
              },
            },
            {
              span: 3,
              title: "Platform Status",
              kind: "statcard",
              component: {
                value: `${origins_node_status}`,
              },
            },
            {
              span: 3,
              title: "Outages",
              kind: "statcard",
              // helperText with <InfoIcon/>
              component: {
                value: `${origins_outages}`, // string or react node?
                // progression
                unit: "",
              },
            },
            {
              span: 3,
              title: "Mean Recovery Time",
              kind: "statcard",
              component: {
                value: `${origins_mean_recovery_time}`,
                unit: "min",
              },
            },
            {
              span: 4,
              title: "Storage Utilisation (Ceph)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "Storage usage",
                  themeColor: ChartThemeColor.teal,
                  ariaTitle: "Donut utilization chart example",
                  constrainToVisibleArea: true,
                  data: {
                    x: "Storage usage",
                    y: getPercentage(origins_ceph_used, origins_ceph_available),
                  },
                  labels: [
                    fmtByteValue(origins_ceph_used) + " used",
                    fmtByteValue(origins_ceph_available - origins_ceph_used) +
                      " remaining",
                  ],
                  name: "origins ceph usage",
                  subTitle: "of " + fmtByteValue(origins_ceph_available),
                  // title: fmtByteValue(origins_ceph_used),
                  title:
                    getPercentage(
                      origins_ceph_used,
                      origins_ceph_available,
                      true
                    ) + "%",
                },
              },
            },
            {
              span: 4,
              title: "Memory Utilisation (RAM)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "Memory usage",
                  themeColor: ChartThemeColor.blue,
                  ariaTitle: "Donut utilization chart example",
                  constrainToVisibleArea: true,
                  data: {
                    x: "Memory usage",
                    y: getPercentage(
                      origins_memory_used,
                      origins_memory_available
                    ),
                  },
                  labels: [
                    fmtByteValue(origins_memory_used) + " used",
                    fmtByteValue(
                      origins_memory_available - origins_memory_used
                    ) + " remaining",
                  ],
                  name: "origins memory usage",
                  subTitle: "of " + fmtByteValue(origins_memory_available),
                  // title: fmtByteValue(origins_memory_used),
                  title:
                    getPercentage(
                      origins_memory_used,
                      origins_memory_available,
                      true
                    ) + "%",
                },
              },
            },
            {
              span: 4,
              title: "CPU Utilisation (cores)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "CPU usage",
                  ariaTitle: "Donut utilization chart example",
                  themeColor: ChartThemeColor.purple,
                  constrainToVisibleArea: true,
                  data: {
                    x: "CPU usage",
                    y: getPercentage(origins_cpu_used, origins_cpu_available),
                  },
                  labels: [
                    origins_cpu_used + " used",
                    origins_cpu_available - origins_cpu_used + " remaining",
                  ],
                  name: "origins memory usage",
                  subTitle: "of " + origins_cpu_available + " cores",
                  // title: origins_cpu_used + "",
                  title:
                    getPercentage(
                      origins_cpu_used,
                      origins_cpu_available,
                      true
                    ) + "%",
                },
              },
            },
            {
              span: 6,
              title: "Pods",
              kind: "statcard",
              component: {
                value: `${origins_pods}`,
                unit: "",
              },
            },
            {
              span: 6,
              title: "Virtual Machines",
              kind: "statcard",
              component: {
                value: `${origins_vms}`,
                unit: "",
              },
            },
            {
              span: 3,
              title: "API internal curl latency",
              kind: "statcard",
              component: {
                value: `${origins_api_latency_internal}`,
                unit: "ms",
              },
            },
            {
              span: 3,
              title: "Ingress internal curl latency",
              kind: "statcard",
              component: {
                value: `${origins_ingress_latency_internal}`,
                unit: "ms",
              },
            },
            {
              span: 3,
              title: "API external curl latency",
              kind: "statcard",
              component: {
                value: `${origins_api_latency_external}`,
                unit: "ms",
              },
            },
            {
              span: 3,
              title: "Ingress external curl latency",
              kind: "statcard",
              component: {
                value: `${origins_ingress_latency_external}`,
                unit: "ms",
              },
            },
          ]}
        />

        <Dashboard
          title="Origins L1 Platform"
          cardProps={{ id: "cloud-metrics-origins-l1", isCompact: true }}
          components={[
            {
              span: 3,
              title: "Uptime",
              kind: "statcard",
              component: {
                value: `${downtimeToUptimePercent(
                  originsl1_downtime,
                  coveringDates
                )}`,
                unit: "%",
              },
            },
            {
              span: 3,
              title: "Platform Status",
              kind: "statcard",
              component: {
                value: `${originsl1_node_status}`,
              },
            },
            {
              span: 3,
              title: "Outages",
              kind: "statcard",
              // helperText with <InfoIcon/>
              component: {
                value: `${originsl1_outages}`, // string or react node?
                // progression
                unit: "",
              },
            },
            {
              span: 3,
              title: "Mean Recovery Time",
              kind: "statcard",
              component: {
                value: `${originsl1_mean_recovery_time}`,
                unit: "min",
              },
            },
            {
              span: 4,
              title: "Storage Utilisation (Pool)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "Storage usage",
                  themeColor: ChartThemeColor.teal,
                  ariaTitle: "Donut utilization chart example",
                  constrainToVisibleArea: true,
                  data: {
                    x: "Storage usage",
                    y: getPercentage(
                      originsl1_flashsystem_used,
                      originsl1_flashsystem_available
                    ),
                  },
                  labels: [
                    fmtByteValue(originsl1_flashsystem_used) + " used",
                    fmtByteValue(
                      originsl1_flashsystem_available -
                        originsl1_flashsystem_used
                    ) + " remaining",
                  ],
                  name: "origins flashsystem usage",
                  subTitle:
                    "of " + fmtByteValue(originsl1_flashsystem_available),
                  title:
                    getPercentage(
                      originsl1_flashsystem_used,
                      originsl1_flashsystem_available,
                      true
                    ) + "%",
                },
              },
            },
            {
              span: 4,
              title: "Memory Utilisation (RAM)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "Memory usage",
                  themeColor: ChartThemeColor.blue,
                  ariaTitle: "Donut utilization chart example",
                  constrainToVisibleArea: true,
                  data: {
                    x: "Memory usage",
                    y: getPercentage(
                      originsl1_memory_used,
                      originsl1_memory_available
                    ),
                  },
                  labels: [
                    fmtByteValue(originsl1_memory_used) + " used",
                    fmtByteValue(
                      originsl1_memory_available - originsl1_memory_used
                    ) + " remaining",
                  ],
                  name: "origins memory usage",
                  subTitle: "of " + fmtByteValue(originsl1_memory_available),
                  title: fmtByteValue(originsl1_memory_used),
                },
              },
            },
            {
              span: 4,
              title: "CPU Utilisation (cores)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "CPU usage",
                  ariaTitle: "Donut utilization chart example",
                  themeColor: ChartThemeColor.purple,
                  constrainToVisibleArea: true,
                  data: {
                    x: "CPU usage",
                    y: getPercentage(
                      originsl1_cpu_used,
                      originsl1_cpu_available
                    ),
                  },
                  labels: [
                    getPercentage(
                      originsl1_cpu_used,
                      originsl1_cpu_available,
                      true
                    ) + "% used",
                    originsl1_cpu_available - originsl1_cpu_used + " remaining",
                  ],
                  name: "origins memory usage",
                  subTitle: "of " + originsl1_cpu_available + " cores",
                  title: originsl1_cpu_used + "",
                },
              },
            },
            {
              span: 6,
              title: "Pods",
              kind: "statcard",
              component: {
                value: `${originsl1_pods}`,
                unit: "",
              },
            },
            {
              span: 6,
              title: "Virtual Machines",
              kind: "statcard",
              component: {
                value: ``,
                unit: "0",
              },
            },
            {
              span: 3,
              title: "API internal curl latency",
              kind: "statcard",
              component: {
                value: `${originsl1_api_latency_internal}`,
                unit: "ms",
              },
            },
            {
              span: 3,
              title: "Ingress internal curl latency",
              kind: "statcard",
              component: {
                value: `${originsl1_ingress_latency_internal}`,
                unit: "ms",
              },
            },
            {
              span: 3,
              title: "API external curl latency",
              kind: "statcard",
              component: {
                value: `${originsl1_api_latency_external}`,
                unit: "ms",
              },
            },
            {
              span: 3,
              title: "Ingress external curl latency",
              kind: "statcard",
              component: {
                value: `${originsl1_ingress_latency_external}`,
                unit: "ms",
              },
            },
          ]}
        />

        <Dashboard
          title="Internal OCP"
          cardProps={{ id: "cloud-metrics-ocp", isCompact: true }}
          components={[
            {
              span: 4,
              title: "Storage Utilisation (Ceph)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "Storage usage",
                  themeColor: ChartThemeColor.teal,
                  ariaTitle: "Donut utilization chart example",
                  constrainToVisibleArea: true,
                  data: {
                    x: "Storage usage",
                    y: getPercentage(ocp_ceph_used, ocp_ceph_available),
                  },
                  labels: [
                    getPercentage(ocp_ceph_used, ocp_ceph_available, true) +
                      "% used",
                    fmtByteValue(ocp_ceph_available - ocp_ceph_used) +
                      " remaining",
                  ],
                  name: "ocp ceph usage",
                  subTitle: "of " + fmtByteValue(ocp_ceph_available),
                  title: fmtByteValue(ocp_ceph_used),
                },
              },
            },
            {
              span: 4,
              title: "Memory Utilisation (RAM)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "Memory usage",
                  themeColor: ChartThemeColor.blue,
                  ariaTitle: "Donut utilization chart example",
                  constrainToVisibleArea: true,
                  data: {
                    x: "Memory usage",
                    y: getPercentage(ocp_memory_used, ocp_memory_available),
                  },
                  labels: [
                    getPercentage(ocp_memory_used, ocp_memory_available, true) +
                      "% used",
                    fmtByteValue(ocp_memory_available - ocp_memory_used) +
                      " remaining",
                  ],
                  name: "ocp memory usage",
                  subTitle: "of " + fmtByteValue(ocp_memory_available),
                  title: fmtByteValue(ocp_memory_used),
                },
              },
            },
            {
              span: 4,
              title: "CPU Utilisation (cores)",
              kind: "newdonutchart",
              component: {
                donutChartProps: {
                  ariaDesc: "CPU usage",
                  ariaTitle: "Donut utilization chart example",
                  themeColor: ChartThemeColor.purple,
                  constrainToVisibleArea: true,
                  data: {
                    x: "CPU usage",
                    y: getPercentage(ocp_cpu_used, ocp_cpu_available),
                  },
                  labels: [
                    getPercentage(ocp_cpu_used, ocp_cpu_available, true) +
                      "% used",
                    ocp_cpu_available - ocp_cpu_used + " remaining",
                  ],
                  name: "ocp memory usage",
                  subTitle: "of " + ocp_cpu_available + " cores",
                  title: ocp_cpu_used + "",
                },
              },
            },
            {
              span: 6,
              title: "Pods",
              kind: "statcard",
              component: {
                value: `${ocp_pods}`,
                unit: "",
              },
            },
            {
              span: 6,
              title: "Virtual Machines",
              kind: "statcard",
              component: {
                value: `${ocp_vms}`,
                unit: "",
              },
            },
          ]}
        />

        <Dashboard
          title="Ceph Storage Cluster"
          cardProps={{ id: "cloud-metrics-ceph", isCompact: true }}
          components={[
            {
              span: 12,
              title: "Overall Storage Consumption",
              kind: "newbulletchart",
              component: {
                bulletChartProps: {
                  ariaDesc: "Storage consumption",
                  themeColor: ChartThemeColor.teal,
                  constrainToVisibleArea: true,
                  ariaTitle: "Donut utilization chart example",
                  legendAllowWrap: true,
                  padding: {
                    bottom: 50,
                    left: 50,
                    right: 50,
                    top: 10, // Adjusted to accommodate labels
                  },

                  axisComponent: (
                    <ChartAxis
                      tickFormat={(val: number) => fmtByteValue(val)}
                    />
                  ),
                  legendComponent: (
                    <ChartLegend theme={getTheme(ChartThemeColor.teal)} />
                  ),
                  qualitativeRangeComponent: (
                    <ChartBulletQualitativeRange
                      theme={getTheme(ChartThemeColor.teal)}
                    />
                  ),
                  labels: ({ datum }) =>
                    `${datum.name}: ${fmtByteValue(datum.y)}`,
                  comparativeWarningMeasureData: [
                    {
                      name: "Warning Territory",
                      y: getPercentOfNumber(ceph_storage_available, 60),
                    },
                  ],
                  comparativeErrorMeasureData: [
                    {
                      name: "Dangerous Territory",
                      y: getPercentOfNumber(ceph_storage_available, 80),
                    },
                  ],
                  qualitativeRangeData: [
                    {
                      name: "Origins HP",
                      y: origins_ceph_used,
                    },
                    { name: "Internal OCP", y: ocp_ceph_used },
                    { name: "Total Used", y: ceph_storage_used },
                  ],

                  maxDomain: { y: ceph_storage_available },
                  qualitativeRangeLegendData: [
                    { name: "Origins HP" },
                    { name: "Internal OCP" },
                    { name: "Total Used" },
                  ],
                },
              },
            },
          ]}
        />

        <Dashboard
          title="IBM Flashsystem Storage"
          cardProps={{ id: "cloud-metrics-flashsystem", isCompact: true }}
          components={[
            {
              span: 12,
              title: "Overall Storage Consumption",
              kind: "newbulletchart",
              component: {
                bulletChartProps: {
                  ariaDesc: "Storage consumption",
                  themeColor: ChartThemeColor.purple,
                  constrainToVisibleArea: true,
                  ariaTitle: "Donut utilization chart example",
                  legendAllowWrap: true,
                  padding: {
                    bottom: 50,
                    left: 50,
                    right: 50,
                    top: 10, // Adjusted to accommodate labels
                  },

                  axisComponent: (
                    <ChartAxis
                      tickFormat={(val: number) => fmtByteValue(val)}
                    />
                  ),
                  legendComponent: (
                    <ChartLegend theme={getTheme(ChartThemeColor.purple)} />
                  ),
                  qualitativeRangeComponent: (
                    <ChartBulletQualitativeRange
                      theme={getTheme(ChartThemeColor.purple)}
                    />
                  ),
                  labels: ({ datum }) =>
                    `${datum.name}: ${fmtByteValue(datum.y)}`,
                  comparativeWarningMeasureData: [
                    {
                      name: "Warning Territory",
                      y: getPercentOfNumber(flashsystem_storage_available, 60),
                    },
                  ],
                  comparativeErrorMeasureData: [
                    {
                      name: "Dangerous Territory",
                      y: getPercentOfNumber(flashsystem_storage_available, 80),
                    },
                  ],
                  qualitativeRangeData: [
                    { name: "Total Used", y: flashsystem_storage_used },
                  ],

                  maxDomain: { y: flashsystem_storage_available },
                  qualitativeRangeLegendData: [{ name: "Total Used" }],
                },
              },
            },
          ]}
        />
      </div>
    );
  }

  return <></>;
};
