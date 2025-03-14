import {
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateBody,
  PageSection,
  Panel,
} from "@patternfly/react-core";
import { UserIcon } from "@patternfly/react-icons";
import { typedUseStoreState } from "../../store";
import { User } from "../../types/user";
import { Report } from "../../types/report";
import { DepartmentCard } from "../../components/DepartmentCard";
import { useEffect, useState } from "react";
import { RecentReports } from "../../components/RecentReports";

export default function Home() {
  const user = typedUseStoreState(
    (state) => state.auth.user! as User & { role: "basic" }
  );

  return (
    <PageSection
      isFilled
      isCenterAligned
      hasBodyWrapper={false}
      style={{ display: "flex", flexDirection: "column", rowGap: 40 }}
    >
      {/* <Panel style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
          <Content component={ContentVariants.h1} style={{ margin: 0 }}>
            Hi, {user.name}
          </Content>
          <Content component={ContentVariants.h3} style={{ margin: 0 }}>
            Welcome to your Reporting Platform
          </Content>
        </div>
      </Panel> */}
      <Panel>
        <Content component={ContentVariants.h4}>Your Departments</Content>
        <div style={{ display: "flex" }}>
          {user.departmentAccess.map((dep) => (
            <DepartmentCard
              key={dep._id}
              title={dep.title}
              category={dep.category}
              access={dep.access}
            />
          ))}
        </div>
      </Panel>
      <Panel>
        <Content component={ContentVariants.h4}>Recent Reports</Content>
        <RecentReports />
      </Panel>
    </PageSection>
  );
}
