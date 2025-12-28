import { useCallback } from "react";
import { overlay } from "overlay-kit";
import MobileTable from "@/components/ui/MobileTable";
import Table from "@/components/ui/Table";
import ApplicationModal from "@/pages/main/guest/application/ApplicationModal";
import ApplicationStatusChip from "@/pages/main/guest/application/ApplicationStatusChip";
import { storeApplicationMock } from "@/pages/main/guest/application/mock";
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

function GuestApplicationPage() {
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

  const handleOpenModal = useCallback((application: StoreApplication) => {
    overlay.open((overlayProps) => (
      <ApplicationModal application={application} {...overlayProps} />
    ));
  }, []);

  return (
    <div className="h-screen w-screen bg-white pt-6 md:bg-gray-700 md:p-5 lg:px-15 lg:py-8">
      <div className="h-full rounded-none bg-white px-5 md:rounded-4xl md:p-8">
        <header className="flex flex-col gap-2.5 md:gap-3 lg:gap-5">
          <h1 className="text-gray-0 text-lg font-semibold md:text-xl md:font-bold lg:text-[28px]">
            매장 등록 현황
          </h1>
          <div className="h-px w-full bg-gray-500" />
        </header>
        <article className="hidden py-6 md:block">
          <Table>
            <Table.Header>
              {columns.map((column) => (
                <Table.Head key={column.label} style={{ flex: (column.flex / 1736) * 100 }}>
                  {column.label}
                </Table.Head>
              ))}
            </Table.Header>
            <Table.Body>
              {storeApplicationMock.map((application, index) => (
                <Table.Row
                  key={application.registrationId}
                  onClick={() => handleOpenModal(application)}
                >
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
          {storeApplicationMock.map((mock, index) => (
            <MobileTable key={mock.registrationId}>
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
      </div>
    </div>
  );
}

export default GuestApplicationPage;
