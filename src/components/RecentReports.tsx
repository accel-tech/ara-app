import { useEffect } from "react";
import { Report } from "../types/report";
import { useFetch } from "../hooks/useFetch";
import { LoadingReportCard, ReportCard } from "./ReportCard";
import { typedUseStoreActions, typedUseStoreState } from "../store";
import { EmptyState } from "@patternfly/react-core";
import { User } from "../types/user";
import { combineWithoutDuplicateId } from "../utils/misc";

export const RecentReports = () => {
  const user = typedUseStoreState(
    (state) => state.auth.user as User & { role: "basic" }
  );
  const { isLoading, isInitialized, documents, errorMessage } =
    typedUseStoreState((state) => state.reports);
  const setReports = typedUseStoreActions(
    (actions) => actions.reports.setDocuments
  );

  const httpRequest = useFetch();

  async function fetchReports() {
    if (isLoading || isInitialized) return;
    setReports({ isLoading: true });
    const { data, error } = await httpRequest<Report[]>(
      `/reports?_populateProjectTasks=true&_populateMetrics=true&_sort=-dateCreated`
    );
    setReports({ isLoading: false });
    if (error) {
      return setReports({ errorMessage: error.message });
    } else if (data) {
      setReports({
        documents: combineWithoutDuplicateId(documents, data, "replace"),
        isInitialized: true,
      });
    }
  }

  useEffect(() => {
    if (!isInitialized) fetchReports();
  });

  if (errorMessage) {
    return (
      <EmptyState>
        <p>error</p>
      </EmptyState>
    );
  }

  return (
    <div style={{ display: "flex", columnGap: 40, flexWrap: "wrap" }}>
      {isLoading && [...Array(4)].map((_, i) => <LoadingReportCard key={i} />)}
      {documents.map((doc) => (
        <ReportCard
          key={doc._id}
          {...doc}
          department={
            user.departmentAccess.find((dep) => dep._id === doc.department._id)!
          }
        />
      ))}
    </div>
  );
};
