import { useState, type FocusEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { overlay } from "overlay-kit";
import { deviceQueries } from "@/api/device/queries";
import Spinner from "@/components/feedback/Spinner";
import { Trash } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox";
import MobileTable from "@/components/ui/MobileTable";
import Pagination from "@/components/ui/Pagination/Pagination";
import Table from "@/components/ui/Table";
import DeviceDeleteModal from "@/pages/main/owner/devices/DeviceDeleteAlert";
import DeviceDetailModal from "@/pages/main/owner/devices/DeviceDetailModal";
import { useStoreId } from "@/stores/useStoreId";
import type { Device } from "@/types/domain/device";

const DEVICE_TRANSLATES = {
  POS: "POS",
  HALL: "홀",
  TABLE: "테이블",
  WAITING: "웨이팅",
};

const columns: { label: string; flex: number; props?: keyof Device }[] = [
  {
    label: "이름",
    flex: 330.67,
    props: "name",
  },
  {
    label: "권한",
    flex: 168,
    props: "purpose",
  },
  {
    label: "결제 방식",
    flex: 330.67,
    props: "paymentType",
  },
  {
    label: "상태",
    flex: 168,
    props: "state",
  },
  {
    label: "등록 일시",
    flex: 330.67,
    props: "createdAt",
  },
];

function MainDevicePage() {
  const { storeId } = useStoreId();

  const [page, setPage] = useState(1);

  const { data: devices, isLoading } = useQuery(deviceQueries.getDevices(storeId!, page));

  const renderCell = (column: (typeof columns)[number], deviceRow: Device) => {
    if (column.props === "paymentType") {
      return deviceRow.paymentType === "POSTPAID" ? "후결제" : "선결제";
    }

    if (column.props === "state") {
      return deviceRow.state === "ACTIVE" ? "활성화" : "비활성화";
    }

    if (column.props === "createdAt") {
      return dayjs(deviceRow.createdAt).format("YY-MM-DD HH:mm");
    }

    if (column.props === "purpose") {
      return (
        <Button
          variant="outline"
          responsive
          responsiveButtons={{
            lg: {
              buttonSize: "custom",
              className: "h-[37px] w-fit rounded-[20px] px-5 py-2 text-sm font-normal",
            },
            md: {
              buttonSize: "custom",
              className: "h-7 px-3 rounded-2xl w-fit text-xs font-normal",
            },
            sm: {
              buttonSize: "custom",
              className: "h-7 px-3 rounded-2xl w-fit text-xs font-normal",
            },
          }}
        >
          {DEVICE_TRANSLATES[deviceRow.purpose]}
        </Button>
      );
    }

    return deviceRow[column.props as keyof Device];
  };

  const [checkedDevices, setCheckedDevices] = useState<Device[]>([]);

  const handleCheckDevice = (deviceRow: Device) => {
    setCheckedDevices((prev) =>
      prev.includes(deviceRow)
        ? prev.filter((device) => device.deviceId !== deviceRow.deviceId)
        : [...prev, deviceRow]
    );
  };
  const handleCheckAll = () => {
    if (checkedDevices.length === devices?.content?.length) {
      setCheckedDevices([]);
    } else {
      setCheckedDevices(devices?.content ?? []);
    }
  };

  const handleCheckboxFocus = (e: FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
  };

  const handleDeleteDevice = () => {
    overlay.open((overlayProps) => (
      <DeviceDeleteModal {...overlayProps} deleteItem={checkedDevices} />
    ));
  };

  const handleDetailDevice = (deviceId: string) => {
    overlay.open((overlayProps) => <DeviceDetailModal {...overlayProps} deviceId={deviceId} />);
  };

  if (isLoading)
    return (
      <div className="center flex h-full">
        <Spinner className="size-10" />
      </div>
    );

  if (!devices?.content?.length)
    return (
      <div className="center flex h-full">
        <p className="text-gray-0 text-lg font-medium">등록된 기기가 없습니다.</p>
      </div>
    );

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 md:px-0">
        <div className="flex items-end justify-end pt-4 lg:pt-6">
          <button
            className="text-status-error flex items-center gap-1 text-sm font-medium lg:text-lg"
            onClick={handleDeleteDevice}
          >
            <Trash className="size-4.5 lg:size-6" />
            삭제
          </button>
        </div>
        <div className="flex flex-col py-4 md:py-3 lg:py-4">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ flex: (66 / 1394) * 100 }}>
                  <Checkbox
                    checked={
                      (devices?.content?.length ?? 0) > 0 &&
                      checkedDevices.length === devices?.content?.length
                    }
                    onCheckedChange={handleCheckAll}
                    onFocus={handleCheckboxFocus}
                  />
                </Table.Head>
                {columns.map((column) => (
                  <Table.Head key={column.label} style={{ flex: (column.flex / 1394) * 100 }}>
                    {column.label}
                  </Table.Head>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {devices?.content?.map((deviceRow) => (
                <Table.Row
                  key={deviceRow.deviceId}
                  onClick={() => handleDetailDevice(deviceRow.deviceId)}
                >
                  <Table.Head
                    style={{ flex: (66 / 1394) * 100 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={checkedDevices.includes(deviceRow)}
                      onCheckedChange={() => handleCheckDevice(deviceRow)}
                      onFocus={handleCheckboxFocus}
                    />
                  </Table.Head>
                  {columns.map((column) => (
                    <Table.Cell key={column.label} style={{ flex: (column.flex / 1394) * 100 }}>
                      {renderCell(column, deviceRow)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {devices?.content?.map((device, index) => (
            <div className="mb-4 flex flex-col gap-2 last:mb-0 md:hidden" key={device.deviceId}>
              <div className="text-gray-0 flex items-center gap-2.5 text-lg font-semibold">
                <Checkbox
                  checked={checkedDevices.includes(device)}
                  onCheckedChange={() => handleCheckDevice(device)}
                  onFocus={handleCheckboxFocus}
                />
                {index + 1}
              </div>
              <MobileTable>
                {columns.map((column, columnIndex) => (
                  <MobileTable.Row
                    key={column.label}
                    onClick={() => handleDetailDevice(device.deviceId)}
                  >
                    <MobileTable.Head>{column.label}</MobileTable.Head>
                    <MobileTable.Cell
                      className={
                        columnIndex === columns.length - 1 ? "border-b-0 whitespace-normal" : ""
                      }
                    >
                      {renderCell(column, device)}
                    </MobileTable.Cell>
                  </MobileTable.Row>
                ))}
              </MobileTable>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto flex justify-center pb-6">
        <Pagination
          currentPage={page}
          pagination={devices}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}

export default MainDevicePage;
