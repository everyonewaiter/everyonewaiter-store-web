import Button from "@/components/ui/Button/Button";
import type { ButtonColor } from "@/components/ui/Button/Button.types";
import type { ApplicationStatus } from "@/types/domain/store";

interface ApplicationStatusChipProps {
  status: ApplicationStatus;
}

function ApplicationStatusChip({ status }: Readonly<ApplicationStatusChipProps>) {
  const getText = () => {
    switch (status) {
      case "APPLY":
        return "접수";
      case "APPROVE":
        return "승인";
      case "REJECT":
        return "반려";
      case "REAPPLY":
        return "재접수";
      default:
        return "";
    }
  };

  return (
    <Button
      color={status.toLowerCase() as ButtonColor}
      responsive
      responsiveButtons={{
        lg: {
          buttonSize: "custom",
          className: "w-fit px-5 py-2 rounded-lg text-sm font-normal !cursor-default",
        },
        md: {
          buttonSize: "custom",
          className: "w-fit px-3 py-1 rounded-lg text-xs font-normal !cursor-default",
        },
        sm: {
          buttonSize: "custom",
          className: "w-fit px-3 py-1 rounded-md",
        },
      }}
    >
      {getText()}
    </Button>
  );
}

export default ApplicationStatusChip;
