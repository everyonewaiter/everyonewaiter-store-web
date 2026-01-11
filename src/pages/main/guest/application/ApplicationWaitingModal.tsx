import Lottie from "lottie-react";
import waiting from "@/assets/json/waiting.json";
import Modal from "@/components/overlay/Modal";
import type { ModalProps } from "@/types/overlay";

function ApplicationWaitingModal(props: ModalProps) {
  return (
    <Modal
      title="매장 등록 신청 현황"
      hasCloseIcon
      open={props.isOpen}
      onOpenChange={(open) => !open && props.close()}
      className="h-fit! lg:rounded-4xl!"
    >
      <div className="center flex h-full flex-col gap-4 py-6 lg:gap-10">
        <Lottie
          animationData={waiting}
          loop
          autoplay
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
          className="h-40 lg:h-60"
        />
        <div className="flex flex-col gap-3 text-center lg:-mt-7">
          <h1 className="text-gray-0 text-lg font-semibold lg:text-2xl">
            매장 신청을 검토 중입니다.
          </h1>
          <p className="text-s font-normal whitespace-pre-line text-gray-300 lg:text-base lg:whitespace-normal">
            {`관리자의 승인이 완료될 때까지\n1~2일 소요될 수 있습니다.`}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default ApplicationWaitingModal;
