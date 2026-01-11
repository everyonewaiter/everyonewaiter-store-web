import type { PropsWithChildren } from "react";
import cn from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  className?: string;
}

function SettingsSection({
  title,
  children,
  className,
}: Readonly<PropsWithChildren<SettingsSectionProps>>) {
  return (
    <section className={cn("flex flex-col gap-3 lg:gap-4", className)}>
      <div className="flex items-center gap-3">
        <div className="bg-primary h-3.5 w-0.5 rounded-3xl lg:h-4" />
        <h3 className="text-gray-0 text-[15px] font-semibold lg:text-lg">{title}</h3>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default SettingsSection;
