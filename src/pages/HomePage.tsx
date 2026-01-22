import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { storesQueries } from "@/api/stores/queries";
import ApplicationTable from "@/components/pages/ApplicationTable";
import Button from "@/components/ui/Button/Button";
import Pagination from "@/components/ui/Pagination/Pagination";
import type { StoreApplication } from "@/types/domain/store";

function HomePage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data: registrations } = useQuery(storesQueries.getRegistrations(page, 6));

  return (
    <div className="flex h-full flex-col gap-3 py-6 md:gap-4">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg" },
            md: { buttonSize: "sm" },
            sm: { buttonSize: "sm", className: "mr-5" },
          }}
          onClick={() => navigate("/create")}
        >
          매장 등록 신청
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 md:px-0">
        <ApplicationTable
          type="user"
          applicationData={registrations?.content as StoreApplication[]}
        />
      </div>
      <div className="mt-auto flex justify-center">
        <Pagination
          currentPage={page}
          pagination={{
            page,
            size: registrations?.size ?? 20,
            pageSkipSize: registrations?.pageSkipSize ?? 0,
            count: registrations?.count ?? 0,
            fastForwardPage: registrations?.fastForwardPage ?? 0,
            fastBackwardPage: registrations?.fastBackwardPage ?? 0,
            isFirst: registrations?.isFirst ?? false,
            isLast: registrations?.isLast ?? false,
          }}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default HomePage;
