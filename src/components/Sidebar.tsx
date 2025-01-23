import { PageSidebar, PageSidebarBody } from "@patternfly/react-core";
import { FC } from "react";

export const Sidebar: FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  return (
    <PageSidebar isSidebarOpen={isSidebarOpen} id="vertical-sidebar">
      <PageSidebarBody></PageSidebarBody>
    </PageSidebar>
  );
};
