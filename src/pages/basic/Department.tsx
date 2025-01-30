import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
  Title,
  ToolbarItem,
} from "@patternfly/react-core";
import { Link, useParams } from "react-router-dom";
import { typedUseStoreState } from "../../store";
import { urlizeString } from "../../utils/misc";
import {
  InfoCircleIcon,
  PlusIcon,
  QuestionCircleIcon,
} from "@patternfly/react-icons";
import { ReportsPage } from "../../components/ReportsPage";
import { useDepartmentAccess } from "../../hooks/useDepartmentAccess";
import { useCreateReportModal } from "../../components/ToolsWrapper";

export default function Department() {
  const params = useParams();
  const urlizedCategory = params.category;
  const urlizedDepartment = params.department;

  const departmentAccess = typedUseStoreState((state) => {
    if (state.auth.user?.role !== "basic") {
      throw new Error("");
    }
    return state.auth.user.departmentAccess;
  });

  const department = departmentAccess.find(
    (dep) =>
      urlizeString(dep.category) === urlizedCategory &&
      urlizeString(dep.title) === urlizedDepartment
  );

  if (!department) {
    return (
      <PageSection isFilled isCenterAligned hasBodyWrapper={false}>
        <EmptyState
          titleText="Page not found"
          headingLevel="h4"
          icon={QuestionCircleIcon}
        >
          <EmptyStateBody>
            We could not find the page or department you are trying to visit.
            Verify the url address or your access.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Link to={"/"}>
                <Button variant="link">Return Home</Button>
              </Link>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </PageSection>
    );
  }

  const access = useDepartmentAccess(department._id);
  const openCreateReportModal = useCreateReportModal();

  return (
    <PageSection isFilled isCenterAligned hasBodyWrapper={false}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <span style={{ color: "gray", fontWeight: 500, fontSize: 13 }}>
            {department.category.toUpperCase()}
          </span>
          <div style={{ display: "flex", columnGap: 5, alignItems: "center" }}>
            <Title headingLevel="h1">{department.title}</Title>
            <Button variant="plain" icon={<InfoCircleIcon />}></Button>
          </div>
        </div>
        <div>
          {access === "lead" && (
            <Button
              variant="control"
              icon={<PlusIcon />}
              onClick={() => openCreateReportModal(department._id)}
              // isDisabled={isLoading}
            >
              New Report
            </Button>
          )}
        </div>
      </div>
      <ReportsPage departmentId={department._id} />
    </PageSection>
  );
}
