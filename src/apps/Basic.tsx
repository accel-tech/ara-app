import { Page } from "@patternfly/react-core";
import { Fragment, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "../components/Header";
import { ToolsWrapper } from "../components/ToolsWrapper";
import { AppEnvironemntBanner } from "../components/AppEnvironmentBanner";
import { Sidebar } from "../components/Sidebar";
import Placeholder from "../pages/basic/Placeholder";
import Department from "../pages/basic/Department";

export default function BasicUserApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  function toggleSidebar() {
    setSidebarOpen((currentVal) => !currentVal);
  }

  return (
    <Fragment>
      <BrowserRouter>
        <ToolsWrapper>
          <AppEnvironemntBanner />
          <Page
            masthead={
              <Header
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            }
            sidebar={<Sidebar isSidebarOpen={isSidebarOpen} />}
            style={{
              height:
                import.meta.env.VITE_APP_ENVIRONMENT !== "production"
                  ? "calc(100vh - 35px)"
                  : "",
            }}
            isContentFilled
          >
            <Routes>
              <Route
                path="/:category/:department"
                Component={() => <Department />}
              />
              <Route path="/" Component={() => <Placeholder />} />
            </Routes>
          </Page>
        </ToolsWrapper>
      </BrowserRouter>
    </Fragment>
  );
}
