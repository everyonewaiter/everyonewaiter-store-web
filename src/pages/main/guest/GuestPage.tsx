import { useState } from "react";
import error from "@/assets/json/error.json";
import successApplication from "@/assets/json/success-application.json";
import waiting from "@/assets/json/waiting.json";
import GuestContent from "@/pages/main/guest/GuestContent";

const content = {
  initial: {
    title: `매장이 등록되어 있지 않아요.\n아래 버튼을 눌러 매장 등록 신청을 해주세요.`,
    description: `매장 등록을 신청하시면 관리자가 확인 후 승인해드려요.\n1~2일 이내에 매장 승인이 완료됩니다!`,
    animationData: successApplication,
  },
  pending: {
    title: `매장 등록 승인을 대기중입니다.`,
    description: `관리자의 승인이 완료될 때까지\n1~2일 소요될 수 있습니다.`,
    animationData: waiting,
  },
  rejected: {
    title: "매장 등록 신청이 반려되었습니다.",
    description: `반려 사유 관련 메일을 발송했습니다.\n메일함을 확인해주세요.`,
    animationData: error,
  },
};

function GuestPage() {
  // TODO: 매장 목록 확인 후 초기값, 대기, 반려 표시
  const [status] = useState<"initial" | "pending" | "rejected">("initial");

  return (
    <div className="center h-full w-full bg-white md:bg-gray-700">
      <div className="flex w-full flex-col items-center justify-center gap-10 rounded-none bg-white px-5 md:w-100 md:rounded-4xl md:p-5 lg:w-120 lg:p-8">
        {content[status] && <GuestContent status={status} {...content[status]} />}
      </div>
    </div>
  );
}

export default GuestPage;
