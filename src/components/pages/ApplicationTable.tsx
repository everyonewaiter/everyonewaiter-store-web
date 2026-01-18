import { useCallback } from "react";
import { overlay } from "overlay-kit";
import MobileTable from "@/components/ui/MobileTable";
import Table from "@/components/ui/Table";
import ApplicationModal from "@/pages/main/guest/application/ApplicationModal";
import ApplicationStatusChip from "@/pages/main/guest/application/ApplicationStatusChip";
import ApplicationWaitingModal from "@/pages/main/guest/application/ApplicationWaitingModal";
import type { StoreApplication } from "@/types/domain/store";

const columns: { label: string; flex: number; prop?: keyof StoreApplication }[] = [
  {
    label: "No.",
    flex: 120,
  },
  {
    label: "신청일",
    flex: 482.67,
    prop: "createdAt",
  },
  {
    label: "상호명",
    flex: 482.67,
    prop: "name",
  },
  {
    label: "상태",
    flex: 168,
    prop: "status",
  },
  {
    label: "사유",
    flex: 482.67,
    prop: "reason",
  },
];

interface ApplicationTableProps {
  type: "guest" | "user";
  applicationData: StoreApplication[];
}

function ApplicationTable({ type, applicationData }: Readonly<ApplicationTableProps>) {
  const renderCellData = useCallback(
    (
      column: { label: string; prop?: keyof StoreApplication },
      columnIdx: number,
      index: number,
      application: StoreApplication
    ) => {
      if (columnIdx === 0) return index + 1;
      if (column.label === "상태") {
        return <ApplicationStatusChip status={application.status} />;
      }
      if (column.label === "사유") {
        if (application.status === "REJECT") return application.reason || "-";
        return "-";
      }
      return application[column.prop as keyof StoreApplication];
    },
    []
  );

  const handleClick = (application: StoreApplication) => {
    if (type === "guest") {
      overlay.open((overlayProps) => (
        <ApplicationModal application={application} showReapplyButton={false} {...overlayProps} />
      ));
      return;
    }

    if (application.status === "APPLY") {
      overlay.open((overlayProps) => <ApplicationWaitingModal {...overlayProps} />);
    } else {
      overlay.open((overlayProps) => (
        <ApplicationModal
          application={application}
          showReapplyButton={application.status === "REJECT"}
          {...overlayProps}
        />
      ));
    }
  };

  return (
    <>
      <article className="hidden flex-1 md:flex">
        <Table>
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.Head key={column.label} style={{ flex: (column.flex / 1736) * 100 }}>
                  {column.label}
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {applicationData.map((application, index) => (
              <Table.Row key={application.registrationId} onClick={() => handleClick(application)}>
                {columns.map((column, columnIdx) => (
                  <Table.Cell key={column.label} style={{ flex: (column.flex / 1736) * 100 }}>
                    {renderCellData(column, columnIdx, index, application)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </article>
      <article className="mt-4 flex flex-col gap-4 md:hidden">
        {applicationData.map((mock, index) => (
          <MobileTable key={mock.registrationId} onClick={() => handleClick(mock)}>
            {columns.map((column, columnIndex) => (
              <MobileTable.Row key={column.label}>
                <MobileTable.Head>{column.label}</MobileTable.Head>
                <MobileTable.Cell
                  className={
                    columnIndex === columns.length - 1 ? "border-b-0 whitespace-normal" : ""
                  }
                >
                  {renderCellData(column, columnIndex, index, mock)}
                </MobileTable.Cell>
              </MobileTable.Row>
            ))}
          </MobileTable>
        ))}
      </article>
    </>
  );
}

export default ApplicationTable;
