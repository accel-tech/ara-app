import { GridItem, gridSpans } from "@patternfly/react-core";
import { FC } from "react";
import { StatCard, statCardProps } from "./StatCard";

import { DonutChartNew, newDonutChartProps } from "./DonutChartNew";
import { BulletChartNew, newBulletChartProps } from "./BulletChartNew";

type dataComp<K, T> = {
  title: string;
  description?: string;
  span?: gridSpans;
  kind: K;
  component: Omit<T, "title" | "description">;
  groupLabel?: string;
};

export type dataComponent =
  | dataComp<"statcard", statCardProps>
  | dataComp<"newdonutchart", newDonutChartProps>
  | dataComp<"newbulletchart", newBulletChartProps>;

export const DataComponent: FC<dataComponent> = ({
  kind,
  title,
  description,
  component,
  span,
  groupLabel,
}) => {
  function Content() {
    switch (kind) {
      case "statcard":
        return (
          <StatCard
            {...(component as statCardProps)}
            title={title}
            description={description}
          />
        );

      case "newdonutchart":
        return (
          <DonutChartNew
            {...(component as newDonutChartProps)}
            title={title}
            description={description}
          />
        );

      case "newbulletchart":
        return (
          <BulletChartNew
            {...(component as newBulletChartProps)}
            title={title}
            description={description}
          />
        );

      default:
        return <div>failed to render</div>;
    }
  }

  return (
    <GridItem span={span || 6}>
      <Content />
    </GridItem>
  );
};
