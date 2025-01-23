import {
  EmptyState,
  EmptyStateBody,
  PageSection,
} from "@patternfly/react-core";
import { UserIcon } from "@patternfly/react-icons";

export default function Placeholder() {
  return (
    <PageSection isFilled isCenterAligned hasBodyWrapper={false}>
      <EmptyState
        titleText="Basic User App"
        headingLevel="h4"
        icon={UserIcon}
        style={{ maxWidth: 600, margin: "auto" }}
        isFullHeight
      >
        <EmptyStateBody>
          This is the basic user app. This is the app that will be accessed by
          users, whether it be regular engineers, team leads, or directors.
        </EmptyStateBody>
      </EmptyState>
    </PageSection>
  );
}
