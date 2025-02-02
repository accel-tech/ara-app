import {
  Button,
  Divider,
  JumpLinks,
  JumpLinksItem,
  Label,
  PageSection,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { FC, Fragment } from "react";
import { Report } from "../types/report";
import { fmtDate1 } from "../utils/misc";
import { ReportMetrics } from "./ReportMetrics";
import { ReportProjects } from "./ReportProjects";
import { ReportCertifications } from "./ReportCertifications";
import { ReportNotes } from "./ReportNotes";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";

export const ReportDisplay: FC<{ report: Report }> = ({ report }) => {
  const access = useDepartmentAccess(report.department._id);
  return (
    <PageSection
      isFilled
      // style={{ border: "1px solid #b9b9b9", borderRadius: 10 }}
      variant="secondary"
    >
      <Toolbar id="toolbar-items-example">
        <ToolbarContent>
          <ToolbarGroup align={{ default: "alignStart" }}>
            <ToolbarItem>
              <p style={{ fontWeight: 500, opacity: 0.5 }}>{report._id}</p>
            </ToolbarItem>
            <ToolbarItem>
              <p style={{ opacity: 0.5, color: "black" }}>
                {fmtDate1(report.coveringDates.from)} to{" "}
                {fmtDate1(report.coveringDates.to)}
              </p>
            </ToolbarItem>
            <ToolbarItem>
              {report.status === "draft" && <Label isCompact>DRAFT</Label>}
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup align={{ default: "alignEnd" }}>
            {access === "member" && report.status === "draft" && (
              <Fragment></Fragment>
            )}
            {access === "lead" && report.status === "draft" && (
              <Fragment>
                <ToolbarItem>
                  <Button variant="secondary">Preview</Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button>Publish</Button>
                </ToolbarItem>
              </Fragment>
            )}
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Sidebar tabIndex={0}>
        <SidebarPanel variant="sticky" hasNoBackground>
          <JumpLinks
            isVertical
            scrollableSelector="#page-element"
            offset={800}
            isExpanded
          >
            <JumpLinksItem href="#cloud-metrics">Cloud Metrics</JumpLinksItem>
            <JumpLinksItem href="#projects">
              Projects
              {/* // if legnth loop through projects */}
            </JumpLinksItem>
            <JumpLinksItem href="#certifications">Certifications</JumpLinksItem>
            <JumpLinksItem href="#notes">Additional Notes</JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent hasNoBackground hasPadding>
          <div style={{ padding: "20px 0" }}>
            <Title headingLevel="h3" style={{ marginBottom: 10 }}>
              Cloud Metrics
            </Title>
            <ReportMetrics
              status={report.status}
              metrics={report.metrics}
              reportId={report._id}
              departmentId={report.department._id}
            />
          </div>
          <Divider />
          <div style={{ padding: "20px 0" }}>
            <Title headingLevel="h3" style={{ marginBottom: 10 }}>
              Projects
            </Title>
            <ReportProjects
              status={report.status}
              projects={report.projects}
              departmentId={report.department._id}
            />
          </div>
          <Divider />
          <div style={{ padding: "20px 0" }}>
            <Title headingLevel="h3" style={{ marginBottom: 10 }}>
              Employee Certification
            </Title>
            <ReportCertifications
              status={report.status}
              certifications={report.certifications}
              reportId={report._id}
              departmentId={report.department._id}
            />
          </div>
          <Divider />
          <div style={{ padding: "20px 0" }}>
            <Title headingLevel="h3" style={{ marginBottom: 10 }}>
              Additional Notes
            </Title>
            <ReportNotes
              reportId={report._id}
              status={report.status}
              notes={report.notes}
              departmentId={report.department._id}
            />
          </div>
        </SidebarContent>
      </Sidebar>
    </PageSection>
  );
};
