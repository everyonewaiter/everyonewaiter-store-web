import notFound from "@/assets/images/not-found.svg";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col gap-6 text-center">
        <img src={notFound} alt="not found page" />
        <p className="text-lg font-medium text-[#9C9FA2]">찾으시는 페이지가 존재하지 않습니다.</p>
      </div>
    </div>
  );
}

export default NotFound;
