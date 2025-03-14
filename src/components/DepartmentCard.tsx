import { Card, CardBody, Content } from "@patternfly/react-core";
import { BuildingIcon } from "@patternfly/react-icons";
import { FC } from "react";
import { capitalizeFirstLetter, departmentToUrl } from "../utils/misc";
import { Link } from "react-router-dom";

export const DepartmentCard: FC<{
  title: string;
  category: string;
  access: string;
}> = ({ title, category }) => {
  return (
    <Link
      to={departmentToUrl({ title, category })}
      style={{ textDecoration: "none", color: "#000" }}
    >
      <Card
        isCompact
        isClickable
        variant="secondary"
        className="live-card-secondary"
      >
        <CardBody
          style={{ display: "flex", alignItems: "center", columnGap: 10 }}
        >
          <BuildingIcon style={{ fontSize: 25 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Content style={{ fontSize: 13, opacity: 0.7 }}>
              {capitalizeFirstLetter(category)}
            </Content>
            <Content style={{ margin: 0, fontWeight: 450 }}>{title}</Content>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};
