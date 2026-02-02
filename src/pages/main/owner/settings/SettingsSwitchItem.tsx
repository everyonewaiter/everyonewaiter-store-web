import { useFormContext, useWatch } from "react-hook-form";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import type { SettingsSchema } from "@/schema/stores/settings.schema";

interface SettingsSwitchItemProps {
  label: string;
  propName: keyof SettingsSchema;
  onChange: (checked: boolean) => void;
}

function SettingsSwitchItem({ label, propName, onChange }: Readonly<SettingsSwitchItemProps>) {
  const form = useFormContext<SettingsSchema>();
  const checked = useWatch({ control: form.control, name: propName }) as boolean;

  return (
    <div className="flex items-center justify-between">
      <Label className="flex items-end gap-2.5 text-sm font-normal">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default SettingsSwitchItem;
