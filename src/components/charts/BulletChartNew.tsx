import { FC, Fragment, useCallback, useState } from "react";
import {
  ChartBullet,
  ChartBulletProps,
} from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

export type newBulletChartProps = {
  title: string;
  bulletChartProps: ChartBulletProps;
};

export const BulletChartNew: FC<newBulletChartProps> = ({
  title,
  bulletChartProps,
}) => {
  const [width, setWidth] = useState(0);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setWidth(Math.floor(node.getBoundingClientRect().width));
    }
  }, []);

  return (
    <Fragment>
      <Card className="h-full" isCompact variant="default">
        <CardTitle component="p" className="!font-medium">
          {title}
        </CardTitle>
        <CardBody>
          <div ref={containerRef}>
            <ChartBullet {...bulletChartProps} width={width} />
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
};
