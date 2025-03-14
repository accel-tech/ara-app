import { Page } from "@patternfly/react-core";
import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "../components/Header";
import { ToolsWrapper } from "../components/ToolsWrapper";
import { AppEnvironemntBanner } from "../components/AppEnvironmentBanner";
import { Sidebar } from "../components/Sidebar";
import Department from "../pages/basic/Department";
import Home from "../pages/basic/Home";

export default function BasicUserApp() {
  console.log("Home rendered");

  return (
    <Fragment>
      <BrowserRouter>
        <ToolsWrapper>
          <AppEnvironemntBanner />
          <Page
            isManagedSidebar
            masthead={<Header />}
            sidebar={<Sidebar />}
            mainContainerId="scrollable-element"
            style={{
              height:
                import.meta.env.VITE_APP_ENVIRONMENT !== "production"
                  ? "calc(100vh - 35px)"
                  : "",
            }}
            isContentFilled
          >
            <Routes>
              <Route path="/:category/:department" element={<Department />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Page>
        </ToolsWrapper>
      </BrowserRouter>
    </Fragment>
  );
}
