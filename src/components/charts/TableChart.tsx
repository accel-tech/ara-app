import React, { FC } from "react";
import { Card, CardBody, CardTitle, Skeleton } from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { DataUnavailable } from "./DataUnavailable";
import { cl } from "../../utils/misc";

type tableCellData = { kind: "plaintext"; value: string };

export type tableData = {
  columns: string[];
  rows: Array<{ [key: string]: tableCellData }>;
};

export type tableChartProps = {
  title: string;
  data: tableData;
};

export const TableChart: React.FunctionComponent<tableChartProps> = ({
  title,
  data,
}) => {
  function renderCell(data: tableCellData) {
    switch (data.kind) {
      case "plaintext":
        return data.value;
      default:
        return `unable to cell`;
    }
  }
  return (
    <Card className="h-full" isCompact>
      <CardTitle component="p" className="!font-medium">
        {title}
      </CardTitle>
      <CardBody>
        <Table>
          <Thead>
            <Tr>
              {data.columns.map((col) => (
                <Th key={col}>{col}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.rows.map((row, i) => (
              <Tr key={`${title}-row-${i}`}>
                {data.columns.map((col) => (
                  <Td dataLabel={col} key={`${title}-row-${i}-col-${col}`}>
                    {renderCell(row[col])}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export const LoadingTableChart: FC<{ title: string }> = ({ title }) => {
  return (
    <Card className="h-full" isCompact>
      <CardTitle component="p" className="!font-medium">
        {title}
      </CardTitle>
      <CardBody>
        <Table>
          <Tbody>
            {[...Array(5)].map((_, i) => (
              <Tr key={i}>
                {[...Array(3)].map((_, i) => (
                  <Td key={i}>
                    <Skeleton className="flex-1 max-w-[100px] h-[20px] opacity-70" />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export const ErrorTableChart: FC<{ title?: string }> = ({ title }) => {
  return (
    <Card isCompact className="h-full">
      <CardTitle component="p" className="!font-medium">
        {title || "-"}
      </CardTitle>
      <CardBody>
        <div className={cl("flex h-[300px]")}>
          {/* <DataError /> */}
          <DataUnavailable />
        </div>
      </CardBody>
    </Card>
  );
};
