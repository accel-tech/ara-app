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
              <Route path="/" element={<Placeholder />} />
            </Routes>
          </Page>
        </ToolsWrapper>
      </BrowserRouter>
    </Fragment>
  );
}
