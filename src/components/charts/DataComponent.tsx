import { GridItem, gridSpans } from "@patternfly/react-core";
import { FC } from "react";
import {
  ErrorStatCard,
  LoadingStatCard,
  StatCard,
  statCardProps,
} from "./StatCard";

import {
  BarChart,
  barChartProps,
  ErrorBarChart,
  LoadingBarChart,
} from "./BarChart";
import {
  DonutChart,
  donutChartProps,
  ErrorDonutChart,
  LoadingDonutChart,
} from "./DonutChart";
import {
  ErrorLineChart,
  LineChart,
  lineChartProps,
  LoadingLineChart,
} from "./LineChart";
import {
  ErrorPieChart,
  LoadingPieChart,
  PieChart,
  pieChartProps,
} from "./PieChart";
import {
  ErrorTableChart,
  LoadingTableChart,
  TableChart,
  tableChartProps,
} from "./TableChart";
import { DonutChartNew, newDonutChartProps } from "./DonutChartNew";
import { BulletChartNew, newBulletChartProps } from "./BulletChartNew";

type dataComp<K, T> = {
  title: string;
  span?: gridSpans;
  kind: K;
  error?: null | string;
  loading?: boolean;
  component?: null | Omit<T, "title">;
  groupLabel?: string;
};

export type dataComponent =
  | dataComp<"statcard", statCardProps>
  | dataComp<"barchart", barChartProps>
  | dataComp<"donutchart", donutChartProps>
  | dataComp<"linechart", lineChartProps>
  | dataComp<"piechart", pieChartProps>
  | dataComp<"tablechart", tableChartProps>
  | dataComp<"newdonutchart", newDonutChartProps>
  | dataComp<"newbulletchart", newBulletChartProps>;

export const DataComponent: FC<dataComponent> = ({
  kind,
  title,
  loading,
  component,
  error,
  span,
  groupLabel,
}) => {
  function Content() {
    switch (kind) {
      case "statcard":
        if (component) {
          return <StatCard {...(component as statCardProps)} title={title} />;
        }
        if (error) {
          console.log(error);
          return <ErrorStatCard title={title} />;
        }

        return <LoadingStatCard title={title} />;

      case "barchart":
        if (component) {
          return <BarChart {...(component as barChartProps)} title={title} />;
        }
        if (error) {
          console.log(error);
          return <ErrorBarChart title={title} />;
        }

        return <LoadingBarChart title={title} />;
      case "donutchart":
        if (component) {
          return (
            <DonutChart {...(component as donutChartProps)} title={title} />
          );
        }
        if (error) {
          console.log(error);
          return <ErrorDonutChart title={title} />;
        }

        return <LoadingDonutChart title={title} />;

      case "piechart":
        if (component) {
          return <PieChart {...(component as pieChartProps)} title={title} />;
        }
        if (error) {
          console.log(error);
          return <ErrorPieChart title={title} />;
        }

        return <LoadingPieChart title={title} />;

      case "linechart":
        if (component) {
          return <LineChart {...(component as lineChartProps)} title={title} />;
        }
        if (error) {
          console.log(error);
          return <ErrorLineChart title={title} />;
        }

        return <LoadingLineChart title={title} />;

      case "tablechart":
        if (component) {
          return (
            <TableChart {...(component as tableChartProps)} title={title} />
          );
        }
        if (error) {
          console.log(error);
          return <ErrorTableChart title={title} />;
        }

        return <LoadingTableChart title={title} />;

      case "newdonutchart":
        if (component) {
          return (
            <DonutChartNew
              {...(component as newDonutChartProps)}
              title={title}
            />
          );
        }

        return <div>...</div>;
      case "newbulletchart":
        if (component) {
          return (
            <BulletChartNew
              {...(component as newBulletChartProps)}
              title={title}
            />
          );
        }

        return <div>...</div>;

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
