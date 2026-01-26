import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import successApplication from "@/assets/json/success-application.json";
import MobileTitle from "@/components/layout/MobileTitle";
import Button from "@/components/ui/Button/Button";

function CategoryEmptyState() {
	const navigate = useNavigate();

	return (
		<div className="flex h-full w-full flex-col items-center justify-start gap-4 px-5 pt-6 md:flex-row md:justify-center md:px-0 md:pt-0">
      <MobileTitle />
      <div className="flex h-[calc(100%-160px)] w-full flex-col items-center justify-center gap-4 pt-5 md:h-auto md:w-auto md:justify-start md:gap-6 md:pt-0 lg:gap-10">
        <Lottie
          animationData={successApplication}
          loop={true}
          className="h-25 w-25 lg:h-40 lg:w-40"
        />
        <h2 className="text-gray-0 text-center text-base font-semibold whitespace-pre-line lg:text-2xl">{`음식의 카테고리가 등록되어있지 않아요.\n아래 버튼을 눌러 카테고리를 등록해주세요.`}</h2>
        <Button
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg", className: "w-100" },
            md: { buttonSize: "sm", className: "w-90" },
            sm: { buttonSize: "sm", className: "w-full absolute bottom-10 w-[calc(100%-72px)]" },
          }}
          onClick={() => navigate("/menus/category")}
        >
          카테고리 등록하기
        </Button>
      </div>
    </div>
	)
}

export default CategoryEmptyState;