import {
  Nav,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from "@patternfly/react-core";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const routes = [
  { path: "/", label: "Home" },
  { path: "/api", label: "API" },
];

export const Sidebar: FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <PageSidebar isSidebarOpen={isSidebarOpen} id="vertical-sidebar">
      <PageSidebarBody>
        <Nav aria-label="Default global" ouiaId="DefaultNav">
          <NavList>
            {routes.map((route) => (
              <NavItem
                preventDefault
                key={route.label}
                id={route.label}
                isActive={location.pathname === route.path}
                onClick={() => navigate(route.path)}
              >
                {route.label}
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};
