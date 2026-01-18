import type { PropsWithChildren } from "react";

function MobileTitle({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex w-full flex-col gap-3 md:hidden">
      <h1 className="text-gray-0 text-lg font-semibold">{children}</h1>
      <div className="h-px w-full bg-gray-600" />
    </div>
  );
}

export default MobileTitle;
