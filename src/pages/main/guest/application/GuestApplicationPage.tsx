import ApplicationTable from "@/components/pages/ApplicationTable";
import { storeApplicationListMock } from "@/pages/main/guest/application/mock";

function GuestApplicationPage() {
  return (
    <div className="h-screen w-screen bg-white pt-6 md:bg-gray-700 md:p-5 lg:px-15 lg:py-8">
      <div className="h-full rounded-none bg-white px-5 md:rounded-4xl md:p-8">
        <header className="flex flex-col gap-2.5 md:gap-3 lg:gap-5">
          <h1 className="text-gray-0 text-lg font-semibold md:text-xl md:font-bold lg:text-[28px]">
            매장 등록 현황
          </h1>
          <div className="h-px w-full bg-gray-500" />
        </header>
        <ApplicationTable type="guest" applicationData={storeApplicationListMock.content} />
      </div>
    </div>
  );
}

export default GuestApplicationPage;
