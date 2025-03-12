import { LoadingHeader, PlainHeader } from "./components/Header";
import "@patternfly/react-core/dist/styles/base.css";
import {
  Button,
  EmptyState,
  EmptyStateBody,
  Page,
  PageSection,
  Spinner,
  Content,
} from "@patternfly/react-core";
import { typedUseStoreState } from "./store";
import { Dots } from "./components/Dots";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useInitAuth } from "./hooks/useInitAuth";
import BasicUserApp from "./apps/Basic";
import AdminUserApp from "./apps/Admin";

function App() {
  const { isLoading, user, errorMessage } = typedUseStoreState(
    (state) => state.auth
  );

  useInitAuth();

  if (isLoading) {
    return <LoadingApp text="Powering up" />;
  }

  if (errorMessage) {
    return <ErrorApp />;
  }

  if (user) {
    return <UserApp role={user.role} />;
  }

  return <GuestApp />;
}

function LoadingApp({ text }: { text?: string }) {
  return (
    <Page masthead={<LoadingHeader />} isContentFilled>
      <PageSection variant="default" hasBodyWrapper={true} isFilled>
        <EmptyState
          isFullHeight
          icon={Spinner}
          titleText={
            <Content className="text-secondary">
              {text}
              <Dots isAnimating />
            </Content>
          }
        ></EmptyState>
      </PageSection>
    </Page>
  );
}

function ErrorApp() {
  return (
    <Page masthead={<PlainHeader />} isContentFilled>
      <PageSection variant="secondary" isFilled hasBodyWrapper={false}>
        <EmptyState
          isFullHeight
          titleText="This app is temporarily unavailable"
          headerClassName="flex flex-col items-center"
          icon={ExclamationCircleIcon}
        >
          <EmptyStateBody className="max-w-[600px]">
            Try refreshing the page. If the problem persists, contact your
            organization administrator or visit our{" "}
            <Button isInline variant="link">
              status page
            </Button>{" "}
            for known outages.
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    </Page>
  );
}

function GuestApp() {
  return (
    <Page masthead={<PlainHeader />} isContentFilled>
      <PageSection variant="secondary" isFilled hasBodyWrapper={false}>
        <EmptyState
          isFullHeight
          headerClassName="flex flex-col items-center"
          titleText="Not logged in"
          icon={ExclamationCircleIcon}
        >
          <EmptyStateBody className="max-w-[600px]">
            You must be logged in. If you are, try refreshing the page. If the
            problem persists, contact your organization administrator.
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    </Page>
  );
}

function UserApp({ role }: { role: string }) {
  if (role == "basic") {
    return <BasicUserApp />;
  }

  if (role === "admin") {
    return <AdminUserApp />;
  }

  return <ErrorApp />;

  // const AdminUserApp = lazy(() => import("./apps/Admin"));
  // const BasicUserApp = lazy(() => import("./apps/Basic"));

  // return (
  //   <Suspense fallback={<LoadingApp />}>
  //     {(() => {
  //       if (role === "admin") {
  //         return <AdminUserApp />;
  //       }
  //       if (role === "basic") {
  //         return <BasicUserApp />;
  //       }

  //       return <ErrorApp />;
  //     })()}
  //   </Suspense>
  // );
}

export default App;
