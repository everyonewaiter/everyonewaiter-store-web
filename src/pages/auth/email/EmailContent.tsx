import emailHourglass from "@/assets/images/email-hourglass.svg";
import Button from "@/components/ui/Button/Button";

interface EmailContentProps {
  title: string;
  description: string;
  handleResendEmail: () => void;
}

function EmailContent({ title, description, handleResendEmail }: Readonly<EmailContentProps>) {
  return (
    <div className="center flex h-screen w-screen flex-col gap-10">
      <img src={emailHourglass} alt="email hourglass" />

      <div className="flex w-111 flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-gray-0 text-2xl font-semibold">{title}</h1>
          <p className="text-base font-normal whitespace-pre-line text-gray-300">{description}</p>
        </div>

        <Button
          color="black"
          responsive
          responsiveButtons={{ lg: { buttonSize: "lg" } }}
          onClick={handleResendEmail}
        >
          이메일 재발송하기
        </Button>
      </div>
    </div>
  );
}

export default EmailContent;
