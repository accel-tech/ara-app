import { FC, Fragment, useCallback, useState } from "react";
import {
  ChartBullet,
  ChartBulletProps,
} from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle, Tooltip } from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";

export type newBulletChartProps = {
  title: string;
  bulletChartProps: ChartBulletProps;
  description?: string;
};

export const BulletChartNew: FC<newBulletChartProps> = ({
  title,
  bulletChartProps,
  description,
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
          <div ref={containerRef}>
            <ChartBullet {...bulletChartProps} width={width} />
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
};
