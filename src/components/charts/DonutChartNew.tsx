import { FC, Fragment } from "react";
import {
  ChartDonutUtilization,
  ChartDonutUtilizationProps,
} from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

export type newDonutChartProps = {
  title: string;
  donutChartProps: ChartDonutUtilizationProps;
};

export const DonutChartNew: FC<newDonutChartProps> = ({
  title,
  donutChartProps,
}) => {
  return (
    <Fragment>
      <Card className="h-full" isCompact variant="default">
        <CardTitle component="p" className="!font-medium">
          {title}
        </CardTitle>
        <CardBody>
          <ChartDonutUtilization {...donutChartProps} />
        </CardBody>
      </Card>
    </Fragment>
  );
};
