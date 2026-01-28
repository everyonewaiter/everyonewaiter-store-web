import { useNavigate } from "react-router-dom";
import notFound from "@/assets/images/not-found.webp";
import { Home } from "@/components/icons";
import Button from "@/components/ui/Button/Button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 md:gap-8 lg:gap-14">
      <img
        src={notFound}
        alt="not found page"
        className="hidden md:mr-7.5 md:block md:w-160 lg:mr-11 lg:w-250"
      />
      <div className="flex flex-col gap-1 text-center lg:gap-2">
        <h1 className="text-[60px] font-semibold md:hidden">404</h1>
        <p className="text-base font-semibold text-gray-100 md:text-lg lg:text-2xl">
          페이지를 찾을 수 없습니다.
        </p>
        <span className="text-s whitespace-pre-line text-gray-300 md:text-sm lg:text-base">
          주소가 잘못되었거나 삭제된 페이지일 수 있습니다.
        </span>
      </div>
      <Button
        variant="outline"
        color="black"
        onClick={() => navigate("/")}
        responsive
        responsiveButtons={{
          sm: {
            buttonSize: "sm",
          },
          md: {
            buttonSize: "sm",
          },
          lg: {
            buttonSize: "lg",
            className: "text-lg! font-normal!",
          },
        }}
      >
        <Home className="size-5 lg:size-6" />
        홈으로 돌아가기
      </Button>
    </div>
  );
}

export default NotFound;
