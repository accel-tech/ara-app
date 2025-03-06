import { Card, CardTitle, CardBody, Skeleton } from "@patternfly/react-core";
import { FC, ReactNode } from "react";
import { DataUnavailable } from "./DataUnavailable";

export type statCardProps = {
  title: string;
  value: string;
  unit?: string | ReactNode;
  unitFirst?: boolean;
  icon?: ReactNode;
};

export const StatCard: FC<statCardProps> = ({
  title,
  value,
  unit,
  unitFirst,
  icon,
}) => {
  return (
    <Card isCompact style={{ height: "100%" }} variant="default">
      <CardTitle component="p" style={{ fontWeight: 400 }}>
        {title || "-"}
      </CardTitle>
      <CardBody
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
        }}
      >
        <div style={{ fontSize: 25, display: "flex", gap: 5, height: 38 }}>
          {!!unitFirst && (
            <span style={{ opacity: 0.6, fontWeight: "medium" }}>{unit}</span>
          )}
          <span style={{ fontWeight: 400 }}>{value}</span>
          {!unitFirst && (
            <span style={{ opacity: 0.5, fontWeight: 400 }}>{unit}</span>
          )}
          {icon && <span>{icon}</span>}
        </div>
      </CardBody>
    </Card>
  );
};

export const LoadingStatCard: FC<{ title?: string }> = ({ title }) => {
  return (
    <Card isCompact style={{ height: "100%" }}>
      <CardTitle component="p" style={{ fontWeight: 400 }}>
        {title || "-"}
      </CardTitle>
      <CardBody>
        <div
          style={{ display: "flex", alignItems: "center", gap: 5, height: 38 }}
        >
          <Skeleton
            style={{ flex: 1, maxWidth: 100, height: 20, opacity: 0.7 }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export const ErrorStatCard: FC<{ title?: string }> = ({ title }) => {
  return (
    <Card isCompact style={{ height: "100%" }}>
      <CardTitle component="p" style={{ fontWeight: 400 }}>
        {title || "-"}
      </CardTitle>
      <CardBody>
        <div style={{ display: "flex", height: 38 }}>
          {/* <DataError /> */}
          <DataUnavailable />
        </div>
      </CardBody>
    </Card>
  );
};
