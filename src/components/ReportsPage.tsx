import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { FC, useEffect, useMemo, useState } from "react";
import { Dots } from "./Dots";
import { dateToWeekRange, fmtDate1 } from "../utils/misc";
import {
  CalendarAltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ErrorCircleOIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";
import { useFetch } from "../hooks/useFetch";
import { useSearchParams } from "react-router-dom";
import { ReportDisplay } from "./ReportDisplay";
import { Report } from "../types/report";
import { typedUseStoreActions, typedUseStoreState } from "../store";

export const ReportsPage: FC<{ departmentId: string }> = ({ departmentId }) => {
  // const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const reports = typedUseStoreState((state) => state.reports.documents);
  const reportsKey = typedUseStoreState((state) => state.reports.key);
  const addDocuments = typedUseStoreActions(
    (actions) => actions.reports.addDocuments
  );

  const httpRequest = useFetch();

  console.log("Report rerendered...");

  const report = useMemo(() => {
    const reportId = searchParams.get("reportId");
    const beforeDate = searchParams.get("beforeDate");
    const afterDate = searchParams.get("afterDate");

    return reports.find((rep) => {
      if (beforeDate) {
        const isBeforeDate =
          new Date(beforeDate).getTime() >
          new Date(rep.coveringDates.to).getTime();
        if (!isBeforeDate) return false;
      }

      if (afterDate) {
        const isAfterDate =
          new Date(afterDate).getTime() <
          new Date(rep.coveringDates.from).getTime();
        if (!isAfterDate) return false;
      }

      if (reportId) {
        const isSameId = rep._id === reportId;
        if (!isSameId) return false;
      }

      return true;
    });
  }, [reportsKey, searchParams]);

  async function findReport() {
    if (isLoading) return;
    setLoading(true);
    const query = [`departmentId=${departmentId}`];

    const reportId = searchParams.get("reportId");
    if (reportId) query.push(`reportId=${reportId}`);

    const beforeDate = searchParams.get("beforeDate");
    if (beforeDate) query.push(`beforeDate=${beforeDate}`);

    const afterDate = searchParams.get("afterDate");
    if (afterDate) query.push(`afterDate=${afterDate}`);

    const { data, error } = await httpRequest<Report>(
      `/reports/find?${query.join("&")}`
    );
    setLoading(false);
    if (error) {
      console.log(error, "Failed to fetch report");
      setError(error.message);
    } else if (data && Object.keys(data).length > 0) {
      addDocuments([data]);
    }
  }

  function findNextReport() {
    if (!report || isLoading) return;
    setSearchParams({
      afterDate: new Date(report.coveringDates.to).toISOString().split("T")[0],
    });
  }

  function findPreviousReport() {
    if (!report || isLoading) return;
    setSearchParams({
      beforeDate: new Date(report.coveringDates.from)
        .toISOString()
        .split("T")[0],
    });
  }

  useEffect(() => {
    if (!isLoading && !report) findReport();
  }, [searchParams.toString()]);

  function Body() {
    // loading skeleton
    if (isLoading) {
      return (
        <EmptyState
          titleText={
            <div style={{ display: "flex" }}>
              <p>Loading Report</p>
              <Dots isAnimating={true} />
            </div>
          }
          headingLevel="h4"
          isFullHeight
        ></EmptyState>
      );
    }

    if (error) {
      return (
        <EmptyState
          titleText="Error Fetching Report"
          headingLevel="h4"
          isFullHeight
          icon={ErrorCircleOIcon}
        >
          <EmptyStateBody>
            We were unable to fetch your report. Try again later or contact your
            system administrator.
          </EmptyStateBody>
        </EmptyState>
      );
    }

    if (!report) {
      return (
        <EmptyState
          titleText="Report not found"
          headingLevel="h4"
          isFullHeight
          icon={WarningTriangleIcon}
        >
          <EmptyStateBody>
            {searchParams.size < 1 ? (
              <p>There are no reports</p>
            ) : (
              <p>Report matching filters not found</p>
            )}
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              {searchParams.size > 0 && (
                <Button variant="link" onClick={() => setSearchParams({})}>
                  Clear Filters
                </Button>
              )}
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      );
    }

    return <ReportDisplay report={report} />;
  }

  return (
    <>
      <PageSection variant="secondary" hasBodyWrapper={false}>
        <Toolbar id="toolbar-items-example" style={{ paddingBottom: 0 }}>
          <ToolbarContent>
            <ToolbarGroup align={{ default: "alignStart" }}></ToolbarGroup>
            <ToolbarGroup align={{ default: "alignEnd" }}>
              <ToolbarItem>
                <Button variant="control" isDisabled>
                  {isLoading ? (
                    <>
                      <Dots isAnimating />
                    </>
                  ) : report ? (
                    <>
                      {fmtDate1(
                        dateToWeekRange(report.coveringDates.from).startOfWeek
                      )}
                      {" - "}
                      {fmtDate1(
                        dateToWeekRange(report.coveringDates.to).endOfWeek,
                        undefined,
                        true
                      )}
                      {searchParams.size === 0 && " (latest)"}
                    </>
                  ) : (
                    "-"
                  )}
                </Button>
                <Button
                  variant="control"
                  icon={<ChevronLeftIcon />}
                  isDisabled={
                    isLoading ||
                    !report ||
                    (!searchParams.get("afterDate") &&
                      !searchParams.get("beforeDate") &&
                      !searchParams.get("reportId")) ||
                    report.status === "draft"
                  }
                  onClick={findNextReport}
                ></Button>
                <Button
                  variant="control"
                  icon={<ChevronRightIcon />}
                  iconPosition="right"
                  isDisabled={isLoading || !report}
                  onClick={findPreviousReport}
                ></Button>
              </ToolbarItem>
              {/* <ToolbarItem>
                <SearchInput isDisabled={isLoading} />
              </ToolbarItem> */}
              {/* <ToolbarItem>
                <Button
                  variant="control"
                  icon={<CalendarAltIcon />}
                  iconPosition="right"
                  isDisabled={isLoading}
                >
                  {!searchParams.get("date") ? (
                    <span
                      style={{ fontWeight: 500, textDecoration: "underline" }}
                    >
                      {searchParams.size > 0 ? "Any Date" : "Latest"}
                    </span>
                  ) : (
                    <span
                      style={{ fontWeight: 500, textDecoration: "underline" }}
                    >
                      {fmtDate1(
                        dateToWeekRange(new Date(searchParams.get("date")!))
                          .startOfWeek
                      )}
                      {" - "}
                      {fmtDate1(
                        dateToWeekRange(new Date(searchParams.get("date")!))
                          .endOfWeek
                      )}
                    </span>
                  )}
                </Button>
              </ToolbarItem> */}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <Body />
    </>
  );
};
