import { FC, Fragment } from "react";
import {
  ChartDonutUtilization,
  ChartDonutUtilizationProps,
} from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle, Tooltip } from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";

export type newDonutChartProps = {
  title: string;
  donutChartProps: ChartDonutUtilizationProps;
  description?: string;
};

export const DonutChartNew: FC<newDonutChartProps> = ({
  title,
  description,
  donutChartProps,
}) => {
  return (
    <Fragment>
      <Card className="h-full" isCompact variant="default">
        <CardTitle
          component="div"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span style={{ fontWeight: undefined }}>{title}</span>
          {description && (
            <Tooltip content={<span>{description}</span>}>
              <InfoCircleIcon
                className="hover-opacity-full"
                style={{ opacity: 0.5 }}
              />
            </Tooltip>
          )}
        </CardTitle>

        <CardBody>
          <ChartDonutUtilization {...donutChartProps} />
        </CardBody>
      </Card>
    </Fragment>
  );
};
