import { Card, Content, Label, Skeleton } from "@patternfly/react-core";
import { FC } from "react";
import { Report } from "../types/report";
import { departmentToUrl, fmtDate1 } from "../utils/misc";
import { Link } from "react-router-dom";

export const ReportCard: FC<
  Report & { department: { title: string; category: string } }
> = ({ _id, title, department, status, coveringDates }) => {
  return (
    <Link
      to={departmentToUrl(department) + `?reportId=${_id}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        style={{
          width: 225,
          height: 125,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          padding: 10,
          cursor: "pointer",
          userSelect: "none",
        }}
        className="live-card-primary"
      >
        <Content style={{ fontWeight: 500, fontSize: 15 }}>{title}</Content>
        <Content style={{ opacity: 0.7, fontSize: 12 }}>
          {fmtDate1(coveringDates.from)} - {fmtDate1(coveringDates.to)}
        </Content>
        <Label
          style={{ position: "absolute", right: 7, top: 7 }}
          color={status === "published" ? "blue" : "grey"}
        >
          {status.toUpperCase()}
        </Label>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            rowGap: 5,
            width: "85%",
            justifyContent: "center",
          }}
        >
          <div
            style={{ height: 5, backgroundColor: "#4a4a4a", borderRadius: 3 }}
          />
          <div
            style={{ height: 5, backgroundColor: "#4a4a4a", borderRadius: 3 }}
          />
          <div
            style={{
              height: 5,
              backgroundColor: "#4a4a4a",
              width: "60%",
              borderRadius: 3,
            }}
          />
          <div
            style={{ height: 5, backgroundColor: "#4a4a4a", borderRadius: 3 }}
          />
        </div>
        <Content style={{ opacity: 0.7, fontSize: 12 }}>
          {department.title}
        </Content>
      </Card>
    </Link>
  );
};

export const LoadingReportCard: FC<{}> = () => {
  return (
    <Card
      style={{
        width: 225,
        height: 125,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        padding: 10,
        rowGap: 10,
      }}
    >
      <Skeleton style={{ height: 12 }} />
      <Skeleton style={{ height: 8, width: "70%" }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          rowGap: 5,
          width: "85%",
          justifyContent: "center",
        }}
      >
        <Skeleton style={{ height: 5 }} />
        <Skeleton style={{ height: 5 }} />
        <Skeleton style={{ height: 5 }} />
      </div>
      <Skeleton style={{ height: 9 }} />
    </Card>
  );
};
