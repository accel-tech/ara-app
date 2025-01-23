import {
  Dropdown,
  DropdownItem,
  DropdownList,
  Divider,
  MenuToggle,
  MenuToggleElement,
  Avatar,
  NotificationBadge,
  Button,
  ButtonVariant,
  MastheadToggle,
  PageToggleButton,
} from "@patternfly/react-core";
import { useState } from "react";
import {
  Masthead,
  MastheadMain,
  MastheadBrand,
  Brand,
  MastheadContent,
} from "@patternfly/react-core";
import defaultAvatar from "../static/avatar.svg";
import { usePreferencesModal } from "./ToolsWrapper";
import { typedUseStoreState } from "../store";
import { Link } from "react-router-dom";
import {
  BellIcon as _BellIcon,
  BarsIcon,
  QuestionCircleIcon,
} from "@patternfly/react-icons";

export const Header: React.FC<{
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={toggleSidebar}
            id="vertical-nav-toggle"
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <Link to="/">
            <Brand
              src={"/logo-text.svg"}
              alt="Accel Logo"
              heights={{ default: "50px" }}
            />
          </Link>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div></div>
        <div
          className="flex gap-[10px] items-end"
          style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}
        >
          {/* <NotificationBadge
            className=""
            variant={"read"}
            // onClick={(event: any) => onCloseNotificationDrawer(event)}
            aria-label="Notifications"
            // isExpanded={isDrawerExpanded}
          /> */}

          {/* <Button
            aria-label="Help actions"
            variant={ButtonVariant.plain}
            icon={<QuestionCircleIcon />}
          /> */}

          <UserDropdown />
        </div>
      </MastheadContent>
    </Masthead>
  );
};

function UserDropdown() {
  const keycloak = typedUseStoreState((state) => state.auth.keycloak);
  const user = typedUseStoreState((state) => state.auth.user)!;

  const [isOpen, setOpen] = useState(false);
  const openPreferencesModal = usePreferencesModal();

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    console.log("selected", value);
    setOpen(false);
  };

  const onToggleClick = () => {
    setOpen(!isOpen);
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  const avatar = defaultAvatar;

  return (
    <div className="h-full">
      <Dropdown
        isOpen={isOpen}
        onSelect={onSelect}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen)}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          // @ts-ignore
          <MenuToggle
            isFullHeight
            ref={toggleRef}
            onClick={onToggleClick}
            isExpanded={isOpen}
            icon={<Avatar src={avatar} alt="user" />}
          >
            {user.name}
          </MenuToggle>
        )}
      >
        <DropdownList>
          <DropdownItem isDisabled>
            <div
              className="flex flex-col"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <span className="text-xs" style={{ fontSize: "12px" }}>
                Username:
              </span>
              <span>{user.email}</span>
            </div>
          </DropdownItem>
          <Divider component="li" key="separator" />
          <DropdownItem onClick={openPreferencesModal}>
            Preferences
          </DropdownItem>
          <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
        </DropdownList>
      </Dropdown>
    </div>
  );
}

export const PlainHeader: React.FC<{}> = ({}) => {
  return (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <Brand
            src={"/logo-text.svg"}
            alt="Accel Tech"
            heights={{ default: "50px" }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent className="flex items-center justify-between">
        {/* <ProjectDropdown /> */}
        {/* <div className="flex items-center gap-x-[10px] opacity-20 animate-pulse lg:ml-[35px]">
            <div className="w-[150px] h-[20px] bg-white rounded-sm"></div>
          </div>
          <div className="flex items-center gap-x-[10px] opacity-30 animate-pulse">
            <div className="w-[45px] h-[45px] rounded-full bg-white"></div>
            <div className="w-[140px] h-[20px] bg-white rounded-sm"></div>
          </div> */}
      </MastheadContent>
    </Masthead>
  );
};

export const LoadingHeader: React.FC<{}> = ({}) => {
  return (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <Brand
            src={"/logo-text.svg"}
            alt="Accel Tech"
            heights={{ default: "50px" }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent className="flex items-center justify-between">
        <div></div>
        {/* <div className="flex items-center gap-x-[10px] opacity-20 animate-pulse lg:ml-[35px]">
          <div className="w-[150px] h-[20px] bg-white rounded-sm"></div>
        </div> */}
        <div className="flex items-center gap-x-[10px] opacity-30 animate-pulse lg:mr-[25px]">
          <div className="w-[45px] h-[45px] rounded-full bg-white"></div>
          <div className="w-[130px] h-[20px] bg-white rounded-sm"></div>
        </div>
      </MastheadContent>
    </Masthead>
  );
};
