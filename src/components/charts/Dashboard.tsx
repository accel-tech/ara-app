import {
  CardBody,
  CardTitle,
  Grid,
  Card,
  CardProps,
} from "@patternfly/react-core";
import { FC } from "react";
import { DataComponent, dataComponent } from "./DataComponent";

export type dashboardProps = {
  title: string;
  components: dataComponent[];
  cardProps: CardProps;
};

export const Dashboard: FC<dashboardProps> = ({
  title,
  components = [],
  cardProps,
}) => {
  return (
    <Card {...cardProps} variant="default">
      <CardTitle style={{ fontWeight: 500, opacity: 0.7 }}>{title}</CardTitle>
      <CardBody>
        <Grid hasGutter className="" sm={12}>
          {components.map((comp) => (
            <DataComponent key={comp.title} {...comp} />
          ))}
        </Grid>
      </CardBody>
    </Card>
  );
};
