import { useState } from "react";
import ApplicationTable from "@/components/pages/ApplicationTable";
import Pagination from "@/components/ui/Pagination/Pagination";
import { storeApplicationListMock } from "@/pages/main/guest/application/mock";

function HomePage() {
  const [page, setPage] = useState(1);

  // TODO: 매장 등록 신청 api 연동
  // TODO: 페이지네이션 구현 (md:6, lg:10)

  return (
    <div className="flex h-full flex-col py-6">
      <div className="flex-1 overflow-y-auto px-5 md:px-0">
        <ApplicationTable type="user" applicationData={storeApplicationListMock.content} />
      </div>
      <div className="mt-auto flex justify-center pt-4">
        <Pagination
          currentPage={page}
          pagination={storeApplicationListMock}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default HomePage;
