import { useQuery } from "@tanstack/react-query";
import { storesQueries } from "@/api/stores/queries";
import ApplicationTable from "@/components/pages/ApplicationTable";

function GuestApplicationPage() {
  const { data: storeList } = useQuery(storesQueries.getRegistrations(1, 1));

  return (
    <div className="h-screen w-screen bg-white pt-6 md:bg-gray-700 md:p-5 lg:px-15 lg:py-8">
      <div className="flex h-full flex-col gap-6 rounded-none bg-white md:rounded-4xl md:p-8">
        <header className="flex flex-col gap-2.5 md:gap-3 lg:gap-5">
          <h1 className="text-gray-0 text-lg font-semibold md:text-xl md:font-bold lg:text-[28px]">
            매장 등록 현황
          </h1>
          <div className="h-px w-full bg-gray-500" />
        </header>
        <ApplicationTable type="guest" applicationData={storeList?.content ?? []} />
      </div>
    </div>
  );
}

export default GuestApplicationPage;
