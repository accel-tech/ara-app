import React, { createRef, FC, useEffect } from "react";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { ChartConfiguration } from "chart.js";
import { Chart } from "chart.js/auto";
import { cl } from "../../utils/misc";
import { DataUnavailable } from "./DataUnavailable";

export type donutChartProps = {
  title: string;
  data: ChartConfiguration<"doughnut">["data"];
  options?: ChartConfiguration<"doughnut">["options"];
};

export const DonutChart: React.FunctionComponent<donutChartProps> = ({
  title,
  data,
  options: _options,
}) => {
  const elRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    let chart: Chart;
    if (data?.datasets) {
      let ctx = elRef.current?.getContext("2d");

      if (ctx) {
        chart = new Chart(ctx, {
          type: "doughnut",
          data: data,
          //   options: options,
        });
      }
    }

    return () => {
      chart?.destroy();
    };
  }, []);

  return (
    <React.Fragment>
      <Card className="h-full" isCompact>
        <CardTitle component="p" className="!font-medium">
          {title}
        </CardTitle>
        <CardBody>
          <canvas ref={elRef}></canvas>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export const LoadingDonutChart: FC<{ title: string }> = ({ title }) => {
  const elRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    let chart: Chart<"doughnut">;

    let ctx = elRef.current?.getContext("2d");

    if (ctx) {
      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["", "", ""],
          datasets: [
            {
              label: "",
              data: [5, 5, 5],
              backgroundColor: [
                "rgb(220, 220, 220)",
                "rgb(230, 230, 230)",
                "rgb(240, 240, 240)",
              ],
            },
          ],
        },
        options: {
          animation: {
            loop: true,
            easing: "easeOutBack",
            duration: 5000,
          },
          events: [],
        },
      });
    }

    return () => {
      chart?.destroy();
    };
  }, []);
  return (
    <Card className="h-full" isCompact>
      <CardTitle component="p" className="!font-medium">
        {title}
      </CardTitle>
      <CardBody>
        <canvas ref={elRef}></canvas>
      </CardBody>
    </Card>
  );
};

export const ErrorDonutChart: FC<{ title?: string }> = ({ title }) => {
  return (
    <Card className="h-full" isCompact>
      <CardTitle component="p" className="!font-medium">
        {title}
      </CardTitle>
      <CardBody>
        <div className={cl("flex h-[300px]")}>
          {/* <DataError /> */}
          <DataUnavailable />
        </div>
      </CardBody>
    </Card>
  );
};
