import {
  Nav,
  NavGroup,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from "@patternfly/react-core";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { typedUseStoreState } from "../store";
import { User } from "../types/user";
import { capitalizeFirstLetter, departmentToUrl } from "../utils/misc";

const defaultRoutes = [{ path: "/", label: "Home" }];
const adminRoutes = [{ path: "/api", label: "API" }];

type RouteGroup = { label: string; routes: { path: string; label: string }[] };

export const Sidebar: FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = typedUseStoreState((state) => state.auth.user)!;

  const routeGroups = getRoutes(user);

  return (
    <PageSidebar isSidebarOpen={isSidebarOpen} id="vertical-sidebar">
      <PageSidebarBody>
        <Nav aria-label="Default global" ouiaId="DefaultNav">
          {routeGroups.map((group) => (
            <NavGroup
              key={group.label}
              title={capitalizeFirstLetter(group.label)}
            >
              {group.routes.map((route) => (
                <NavItem
                  preventDefault
                  key={route.label}
                  id={route.label}
                  to={route.path}
                  isActive={location.pathname === route.path}
                  onClick={() => navigate(route.path)}
                >
                  {route.label}
                </NavItem>
              ))}
            </NavGroup>
          ))}
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};

function getRoutes(user: User): RouteGroup[] {
  const groups: RouteGroup[] = [
    { label: "General", routes: [{ label: "Home", path: "/" }] },
  ];

  if (user.role === "basic") {
    for (const { title, category } of user.departmentAccess) {
      let index = groups.findIndex((group) => group.label === title);
      if (index === -1) {
        index = groups.push({ label: category, routes: [] }) - 1;
      }
      groups[index].routes.push({
        label: title,
        path: departmentToUrl({ category, title }),
      });
    }
  }
  return groups;
}
