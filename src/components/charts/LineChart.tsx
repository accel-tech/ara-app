import React, { createRef, FC, useEffect } from "react";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { AnimationEvent, ChartConfiguration } from "chart.js";
import { Chart } from "chart.js/auto";
import { DataUnavailable } from "./DataUnavailable";
import { cl, wait } from "../../utils/misc";

export type lineChartProps = {
  title: string;
  data: ChartConfiguration<"line">["data"];
  options?: ChartConfiguration<"line">["options"];
};

export const LineChart: React.FunctionComponent<lineChartProps> = ({
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
          type: "line",
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

export const LoadingLineChart: FC<{ title: string }> = ({ title }) => {
  const elRef = createRef<HTMLCanvasElement>();

  const totalDuration = 90 * 1000;

  const data: any[] = [];
  const data2: any[] = [];
  let prev = 100;
  let prev2 = 80;
  for (let i = 0; i < 50; i++) {
    prev += 5 - Math.random() * 10;
    data.push({ x: i, y: prev });
    prev2 += 5 - Math.random() * 10;
    data2.push({ x: i, y: prev2 });
  }

  const duration = (ctx: any) => {
    return (ctx.index / data.length) * (totalDuration / data.length);
  };

  const delay = (ctx: any) => {
    if (ctx.type !== "data" || ctx.xStarted) {
      return 0;
    }
    ctx.xStarted = true;
    return delay(ctx);
  };

  const restartAmin = ({ chart }: AnimationEvent) => {
    chart.stop();
    wait(2000).then(() => {
      chart.update();
    });
  };

  useEffect(() => {
    let chart: Chart<"line">;

    let ctx = elRef.current?.getContext("2d");

    if (ctx) {
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["", "", "", "", "", ""],
          datasets: [
            {
              label: "",
              data: data,
              pointRadius: 0,
              borderWidth: 3,
              backgroundColor: "rgb(240, 240, 240)",
            },
            {
              label: "",
              data: data2,
              pointRadius: 0,
              borderWidth: 3,

              backgroundColor: "rgb(230, 230, 230)",
            },
          ],
        },
        options: {
          animation: {
            onComplete: restartAmin,
            // @ts-ignore
            x: {
              type: "number",
              easing: "linear",
              from: NaN,
              duration,
              delay,
            },
            y: {
              duration: 0,
            },
          },

          interaction: {
            intersect: false,
          },
          events: [],
          scales: {
            y: {
              display: false,
            },
            x: { display: false, type: "linear" },
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

export const ErrorLineChart: FC<{ title?: string }> = ({ title }) => {
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
