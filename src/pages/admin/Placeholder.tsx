import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
} from "@patternfly/react-core";
import { CogIcon, CubesIcon } from "@patternfly/react-icons";

export default function Placeholder() {
  return (
    <PageSection isFilled isCenterAligned hasBodyWrapper={false}>
      <EmptyState
        titleText="Administrator App"
        headingLevel="h4"
        icon={CogIcon}
        style={{ maxWidth: 600, margin: "auto" }}
        isFullHeight
      >
        <EmptyStateBody>
          This is the administator app. Where overall application configuration,
          users, and other shinanigans can be edited.
        </EmptyStateBody>
      </EmptyState>
    </PageSection>
  );
}
