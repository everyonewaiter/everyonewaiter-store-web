import type { ReactNode } from "react";
import emailHourglass from "@/assets/images/email-hourglass.svg";
import Spinner from "@/components/feedback/Spinner";
import Button from "@/components/ui/Button/Button";

interface EmailContentProps {
  title: string;
  description: string;
  onResendEmail: () => void;
  bottomComponent?: ReactNode;
  isResending?: boolean;
}

function EmailContent({
  title,
  description,
  onResendEmail,
  bottomComponent,
  isResending,
}: Readonly<EmailContentProps>) {
  return (
    <div className="center flex h-screen w-screen flex-col gap-6 lg:gap-10">
      <img src={emailHourglass} alt="email hourglass" className="size-35 lg:size-45" />

      <div className="flex w-80 flex-col items-center gap-5 md:w-82 lg:w-111 lg:gap-8">
        <div className="flex flex-col gap-1 text-center lg:gap-2">
          <h1 className="text-gray-0 text-lg font-semibold lg:text-2xl">{title}</h1>
          <p className="text-sm font-normal whitespace-pre-line text-gray-300 lg:text-base">
            {description}
          </p>
        </div>

        {bottomComponent || (
          <Button
            color="black"
            responsive
            responsiveButtons={{
              lg: { buttonSize: "lg", className: "w-full" },
              md: { buttonSize: "md", className: "w-full" },
              sm: { buttonSize: "md" },
            }}
            onClick={onResendEmail}
            disabled={isResending}
          >
            {isResending ? <Spinner /> : "이메일 재발송하기"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmailContent;
