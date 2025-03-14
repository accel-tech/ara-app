import {
  EmptyState,
  EmptyStateBody,
  PageSection,
} from "@patternfly/react-core";
import { HomeIcon } from "@patternfly/react-icons";

export default function Placeholder() {
  return (
    <PageSection isFilled isCenterAligned hasBodyWrapper={false}>
      <EmptyState
        titleText="Reporting App"
        headingLevel="h4"
        icon={HomeIcon}
        style={{ maxWidth: 600, margin: "auto" }}
        isFullHeight
      >
        <EmptyStateBody>
          Welcome to the reporting app. Contact your administrator to place you
          in the correct departments.
        </EmptyStateBody>
      </EmptyState>
    </PageSection>
  );
}
