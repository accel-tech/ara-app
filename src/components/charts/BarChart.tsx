import React, { createRef, FC, useEffect } from "react";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { ChartConfiguration } from "chart.js";
import { Chart } from "chart.js/auto";
import { DataUnavailable } from "./DataUnavailable";
import { cl } from "../../utils/misc";

export type barChartProps = {
  title: string;
  data: ChartConfiguration<"bar">["data"];
  options?: ChartConfiguration<"bar">["options"];
};

export const BarChart: React.FunctionComponent<barChartProps> = ({
  title,
  data,
  options,
}) => {
  const elRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    let chart: Chart;
    if (data?.datasets) {
      let ctx = elRef.current?.getContext("2d");

      if (ctx) {
        chart = new Chart(ctx, {
          type: "bar",
          data: data,
          options: options,
        });
      }
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

export const LoadingBarChart: FC<{ title: string }> = ({ title }) => {
  const elRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    let chart: Chart;

    let ctx = elRef.current?.getContext("2d");

    if (ctx) {
      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["", "", "", "", "", ""],
          datasets: [
            {
              label: "",
              data: [4, 5, 3, 5, 2, 3],
              backgroundColor: "rgb(240, 240, 240)",
            },
          ],
        },
        options: {
          animation: {
            loop: true,
            duration: 4000,
            easing: "easeOutBack",
          },

          events: [],
          scales: {
            y: {
              display: false,
              min: 0,
              max: 6,
            },
            x: { display: false },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
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

export const ErrorBarChart: FC<{ title: string }> = ({ title }) => {
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
