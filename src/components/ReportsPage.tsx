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
  ErrorCircleOIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";
import { useFetch } from "../hooks/useFetch";
import { useSearchParams } from "react-router-dom";
import { ReportDisplay } from "./ReportDisplay";
import { Report } from "../types/report";
import { typedUseStoreActions, typedUseStoreState } from "../store";

export const ReportsPage: FC<{ departmentId: string }> = ({ departmentId }) => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const reports = typedUseStoreState((state) => state.reports.documents);
  const reportsKey = typedUseStoreState((state) => state.reports.key);
  const addDocuments = typedUseStoreActions(
    (actions) => actions.reports.addDocuments
  );

  // const [filters, setFilters] = useState<{ date: Date | null }>({
  //   date: new Date("2024-12-12"),
  // });

  const httpRequest = useFetch();

  async function fetchReports() {
    if (isLoading) return;
    setLoading(true);
    const query = [`departmentId=${departmentId}`];
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

  function findMatchingDocument() {
    const report = reports.find((rep) => rep); // find matching;
    if (report) {
      setReport(report);
      return;
    } else {
      fetchReports();
      return;
    }
  }

  useEffect(() => {
    if (!isLoading) findMatchingDocument();
  }, [searchParams.toString(), reportsKey]);

  function Body() {
    // loading skeleton
    if (isLoading) {
      return (
        <EmptyState
          titleText={
            <div style={{ display: "flex" }}>
              {/* {!searchParams.get("date") ? (
                <p>
                  Loading{" "}
                  <span
                    style={{ fontWeight: 500, textDecoration: "underline" }}
                  >
                    Latest
                  </span>{" "}
                  Report
                </p>
              ) : (
                <span>
                  Loading Report for{" "}
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
                </span>
              )} */}
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
              <p>
                <span style={{ fontWeight: 500, textDecoration: "underline" }}>
                  Latest
                </span>{" "}
                report was not found
              </p>
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
                <SearchInput
                  isDisabled={isLoading}
                  // aria-label="Consumer toggle groups example search input"
                  // onChange={(_event, value) => onInputChange(value)}
                  // value={inputValue}
                  // onClear={() => {
                  //   onInputChange('');
                  // }}
                />
              </ToolbarItem>
              <ToolbarItem>
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
                {/* left button for next */}
                {/* right button for previous */}
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <Body />
    </>
  );
};
