import {
  Button,
  Divider,
  JumpLinks,
  JumpLinksItem,
  JumpLinksList,
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
import { FC, Fragment, useState } from "react";
import { Report } from "../types/report";
import { capitalizeFirstLetter, fmtDate2, urlizeString } from "../utils/misc";
import { ReportMetrics } from "./ReportMetrics";
import { ReportProjects } from "./ReportProjects";
import { ReportCertifications } from "./ReportCertifications";
import { ReportNotes } from "./ReportNotes";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";
import { useFetch } from "../hooks/useFetch";
import { typedUseStoreActions } from "../store";
import { FileDownloadIcon } from "@patternfly/react-icons";

export const ReportDisplay: FC<{ report: Report }> = ({ report }) => {
  const [isPreview, setPreview] = useState(false);
  const [isPublishing, setPublishing] = useState(false);
  const access = useDepartmentAccess(report.department._id);
  const httpRequest = useFetch();

  const patchDocument = typedUseStoreActions(
    (actions) => actions.reports.patchDocument
  );

  async function handlePublish() {
    if (isPublishing) return;
    setPublishing(true);
    setPreview(true);
    const { data, error } = await httpRequest(`/reports/${report._id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "published" }),
    });
    setPublishing(false);
    if (error) {
      console.log(error, "Failed to publish report");
      // show toast
      setPreview(isPreview);
      return;
    }
    if (data) {
      patchDocument({
        _id: report._id,
        fields: { status: "published", datePublished: new Date() },
      });
    }
  }

  return (
    <PageSection
      isFilled
      style={{
        // border: "1px solid rgb(232, 232, 232)",
        borderRadius: 0,
        // backgroundColor: "rgb(254, 252, 234)",
        // backgroundColor: "rgb(246, 250, 254)",
      }}
      variant="secondary"
    >
      <Toolbar id="toolbar-items-example">
        <ToolbarContent>
          <ToolbarGroup align={{ default: "alignStart" }}>
            <ToolbarItem>
              <p style={{ fontWeight: 500, opacity: 0.5 }}>{report._id}</p>
            </ToolbarItem>
            {/* <ToolbarItem>
              <p style={{ opacity: 0.5, color: "black" }}>
                <span style={{ fontWeight: 500 }}>
                  {fmtDate1(report.coveringDates.from, "short")}
                </span>{" "}
                <span>{"<-->"}</span>{" "}
                <span style={{ fontWeight: 500 }}>
                  {fmtDate1(report.coveringDates.to, "short", true)}
                </span>
              </p>
            </ToolbarItem> */}
            <ToolbarItem>
              {report.status === "draft" && <Label>DRAFT</Label>}
              {report.status === "published" && (
                <Label color="blue">
                  PUBLISHED{" "}
                  <span style={{ opacity: 0.5 }}>
                    {fmtDate2(report.datePublished)}
                  </span>
                </Label>
              )}
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup align={{ default: "alignEnd" }}>
            {access === "member" && report.status === "draft" && (
              <Fragment></Fragment>
            )}
            {access === "lead" && report.status === "draft" && (
              <Fragment>
                <ToolbarItem>
                  <Button
                    variant="secondary"
                    onClick={() => setPreview(!isPreview)}
                    isDisabled={isPublishing}
                  >
                    {isPreview ? "Return to Draft" : "Preview"}
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    onClick={handlePublish}
                    isLoading={isPublishing}
                    isDisabled={isPublishing}
                  >
                    Publish
                  </Button>
                </ToolbarItem>
              </Fragment>
            )}
            {report.status === "published" && (
              <Button
                icon={<FileDownloadIcon />}
                variant="control"
                onClick={() => window.alert("download feature not completed")}
              ></Button>
            )}
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Sidebar tabIndex={0}>
        <SidebarPanel variant="sticky" hasNoBackground>
          <JumpLinksSidebar
            status={isPreview ? "published" : report.status}
            projects={report.projects.map((pro) => pro.title)}
          />
        </SidebarPanel>
        <SidebarContent hasNoBackground>
          <PageSection style={{ padding: 0, background: "transparent" }}>
            {(isPreview || report.status === "published") && (
              <Fragment>
                <div style={{ padding: "20px 0" }}>
                  <Title
                    headingLevel="h3"
                    style={{ marginBottom: 10 }}
                    id="cloud-metrics"
                  >
                    Cloud Metrics
                  </Title>
                  <ReportMetrics
                    reportId={report._id}
                    status="published"
                    metrics={report.metrics}
                    departmentId={report.department._id}
                    coveringDates={report.coveringDates}
                  />
                </div>
                <Divider />
              </Fragment>
            )}
            <div style={{ padding: "20px 0" }}>
              <Title
                headingLevel="h3"
                style={{ marginBottom: 10 }}
                id="projects"
              >
                Projects
              </Title>
              <ReportProjects
                reportId={report._id}
                status={isPreview ? "published" : report.status}
                projects={report.projects}
                departmentId={report.department._id}
              />
            </div>
            <Divider />
            <div style={{ padding: "20px 0" }}>
              <Title
                headingLevel="h3"
                style={{ marginBottom: 10 }}
                id="certifications"
              >
                Employee Certification
              </Title>
              <ReportCertifications
                reportId={report._id}
                status={isPreview ? "published" : report.status}
                certifications={report.certifications}
                departmentId={report.department._id}
              />
            </div>
            <Divider />
            <div style={{ padding: "20px 0" }}>
              <Title headingLevel="h3" style={{ marginBottom: 10 }} id="notes">
                Additional Notes
              </Title>
              <ReportNotes
                reportId={report._id}
                status={isPreview ? "published" : report.status}
                notes={report.notes}
                departmentId={report.department._id}
              />
            </div>
            {!isPreview && report.status === "draft" && (
              <Fragment>
                <Divider />
                <div style={{ padding: "20px 0" }}>
                  <Title
                    headingLevel="h3"
                    style={{ marginBottom: 10 }}
                    id="cloud-metrics"
                  >
                    Cloud Metrics
                  </Title>
                  <ReportMetrics
                    reportId={report._id}
                    status="draft"
                    metrics={report.metrics}
                    departmentId={report.department._id}
                    coveringDates={report.coveringDates}
                  />
                </div>
              </Fragment>
            )}
          </PageSection>
        </SidebarContent>
      </Sidebar>
    </PageSection>
  );
};

function JumpLinksSidebar({
  projects,
  status,
}: {
  projects: string[];
  status: Report["status"];
}) {
  console.log("rendered sidebar");

  if (status === "draft") {
    return (
      <JumpLinks
        isVertical
        scrollableSelector="#scrollable-element"
        offset={500}
        isExpanded
      >
        <JumpLinksItem href="#projects">
          Projects
          {projects.length < 1 ? (
            <></>
          ) : (
            <JumpLinksList>
              {projects.map((pro) => (
                <JumpLinksItem key={pro} href={`#${urlizeString(pro)}`}>
                  {capitalizeFirstLetter(pro)}
                </JumpLinksItem>
              ))}
            </JumpLinksList>
          )}
        </JumpLinksItem>
        <JumpLinksItem href="#certifications">Certifications</JumpLinksItem>
        <JumpLinksItem href="#notes">Additional Notes</JumpLinksItem>
        <JumpLinksItem href="#cloud-metrics">Cloud Metrics</JumpLinksItem>
      </JumpLinks>
    );
  }

  if (status === "published") {
    return (
      <JumpLinks
        isVertical
        scrollableSelector="#scrollable-element"
        offset={500}
        isExpanded
      >
        <JumpLinksItem href="#cloud-metrics">
          Cloud Metrics
          <JumpLinksList>
            {[
              { title: "Origins (HP)", href: "#cloud-metrics-origins" },
              {
                title: "Origins (Linux One)",
                href: "#cloud-metrics-origins-l1",
              },
              {
                title: "Internal OCP",
                href: "#cloud-metrics-ocp",
              },
              {
                title: "Ceph Storage",
                href: "#cloud-metrics-ceph",
              },
              {
                title: "IBM FlashSystem",
                href: "#cloud-metrics-flashsystem",
              },
            ].map((platform) => (
              <JumpLinksItem key={platform.href} href={platform.href}>
                {platform.title}
              </JumpLinksItem>
            ))}
          </JumpLinksList>
        </JumpLinksItem>
        <JumpLinksItem href="#projects">
          Projects
          {projects.length < 1 ? (
            <></>
          ) : (
            <JumpLinksList>
              {projects.map((pro) => (
                <JumpLinksItem key={pro} href={`#${urlizeString(pro)}`}>
                  {capitalizeFirstLetter(pro)}
                </JumpLinksItem>
              ))}
            </JumpLinksList>
          )}
        </JumpLinksItem>
        <JumpLinksItem href="#certifications">Certifications</JumpLinksItem>
        <JumpLinksItem href="#notes">Additional Notes</JumpLinksItem>
      </JumpLinks>
    );
  }

  return <></>;
}
