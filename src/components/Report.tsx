import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { FC, useEffect, useState } from "react";
import { Dots } from "./Dots";
import { dateToWeekRange, fmtDate1 } from "../utils/misc";
import {
  CalendarAltIcon,
  ErrorCircleOIcon,
  WarehouseIcon,
  WarningTriangleIcon,
  WarningTriangleIconConfig,
} from "@patternfly/react-icons";
import { useFetch } from "../hooks/useFetch";

export const Report: FC<{ departmentId: string }> = ({ departmentId }) => {
  const [report, setReport] = useState<{} | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ date: Date | null }>({
    date: new Date("2024-12-12"),
  });

  const httpRequest = useFetch();

  async function fetchReport() {
    if (isLoading) return;
    setLoading(true);
    const query = [`departmentId=${departmentId}`];
    const { data, error } = await httpRequest<{}>(
      `/reports/find?${query.join("&")}`
    );
    setLoading(false);
    if (error) {
      console.log(error, "Failed to fetch report");
      setError(error.message);
    } else if (data && Object.keys(data).length > 0) {
      setReport(data);
    }
  }

  useEffect(() => {
    if (!isLoading) fetchReport();
  }, [filters]);
  function Body() {
    // loading skeleton
    if (isLoading) {
      return (
        <EmptyState
          titleText={
            <div style={{ display: "flex" }}>
              {!filters.date ? (
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
                    {fmtDate1(dateToWeekRange(filters.date).startOfWeek)}
                    {" - "}
                    {fmtDate1(dateToWeekRange(filters.date).endOfWeek)}
                  </span>
                </span>
              )}
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
            {!filters.date ? (
              <p>
                <span style={{ fontWeight: 500, textDecoration: "underline" }}>
                  Latest
                </span>{" "}
                report was not found
              </p>
            ) : (
              <p>
                Report for dates{" "}
                <span style={{ fontWeight: 500, textDecoration: "underline" }}>
                  {fmtDate1(dateToWeekRange(filters.date).startOfWeek)}
                  {" - "}
                  {fmtDate1(dateToWeekRange(filters.date).endOfWeek)}
                </span>{" "}
                was not found
              </p>
            )}
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              {filters.date && (
                <Button
                  variant="link"
                  onClick={() => setFilters({ date: null })}
                >
                  Clear Filters
                </Button>
              )}
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      );
    }

    return (
      <div>
        <p>found report</p>
      </div>
    );
  }

  return (
    <PageSection variant="secondary" isFilled hasBodyWrapper={false}>
      <Toolbar id="toolbar-items-example">
        <ToolbarContent>
          <ToolbarGroup align={{ default: "alignEnd" }}>
            <ToolbarItem>
              <Button
                variant="control"
                icon={<CalendarAltIcon />}
                iconPosition="right"
              >
                {!filters.date ? (
                  <span
                    style={{ fontWeight: 500, textDecoration: "underline" }}
                  >
                    Latest
                  </span>
                ) : (
                  <span
                    style={{ fontWeight: 500, textDecoration: "underline" }}
                  >
                    {fmtDate1(dateToWeekRange(filters.date).startOfWeek)}
                    {" - "}
                    {fmtDate1(dateToWeekRange(filters.date).endOfWeek)}
                  </span>
                )}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Body />
    </PageSection>
  );
};
