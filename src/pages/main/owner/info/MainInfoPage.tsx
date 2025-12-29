import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { EditContained, Plus, Trash } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import cn from "@/lib/utils";
import { STORE_DETAIL_MOCK } from "@/pages/main/owner/info/mock";

function MainInfoPage() {
  const data = STORE_DETAIL_MOCK;
  const form = useForm({
    defaultValues: {
      name: data.name,
      license: data.license,
      address: data.address,
      origins: data.setting.countryOfOrigins.map((origin) => ({
        id: crypto.randomUUID(),
        item: origin.item,
        origin: origin.origin,
      })),
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const origins = useWatch({ control: form.control, name: "origins" });

  const addOrigin = () => {
    if (origins.at(-1)?.item === "") return;
    form.setValue("origins", [...origins, { id: crypto.randomUUID(), item: "", origin: "" }]);
  };

  const handleDelete = (id: string) => {
    form.setValue(
      "origins",
      origins.filter((origin) => origin.id !== id)
    );
  };

  return (
    <div
      className={cn(
        "flex h-full w-full justify-center px-5 pt-10 md:px-0",
        origins.length > 4 ? "items-start md:pt-10" : "py-6 md:items-start lg:items-center"
      )}
    >
      <div className="flex w-full flex-col gap-6 md:w-68 lg:w-120 lg:gap-8">
        <div className="flex flex-col gap-2 lg:gap-3">
          <h2 className="text-gray-0 text-lg font-semibold lg:text-2xl">매장 정보</h2>
          <p className="text-xs font-normal whitespace-pre-line text-gray-300 lg:text-sm">{`등록된 매장 정보를 확인할 수 있습니다.\n변경된 정보가 있다면 언제든지 수정해 주세요.`}</p>
        </div>
        <Form {...form}>
          <form className="mt-2 flex flex-col gap-3 md:mt-0 lg:gap-4">
            <FormField control={form.control} name="name" label="상호명" disabled />
            <FormField control={form.control} name="license" label="사업자번호" disabled />
            <FormField
              control={form.control}
              name="address"
              label="주소"
              disabled
              inputProps={{
                onChange: (e) => {
                  // TODO: 사업자번호 포매팅
                  form.setValue("address", e.target.value);
                },
              }}
            />
            {origins.length > 0 ? (
              <Table containerClassName="rounded-xl border border-gray-600 overflow-hidden">
                <Table.Header className="h-10 rounded-none lg:h-13">
                  <Table.Head
                    className={cn(
                      "text-s font-normal lg:text-base",
                      isEditing ? "flex-[0.4]" : "flex-1"
                    )}
                  >
                    품목
                  </Table.Head>
                  <Table.Head
                    className={cn(
                      "text-s font-normal lg:text-base",
                      isEditing ? "flex-[0.4]" : "flex-1"
                    )}
                  >
                    원산지
                  </Table.Head>
                  {isEditing && (
                    <Table.Head className="text-primary text-s flex-[0.2] font-normal lg:text-base">
                      삭제
                    </Table.Head>
                  )}
                </Table.Header>
                <Table.Body>
                  {origins.map((origin, index) => (
                    <Table.Row key={origin.id} className="flex h-10 lg:h-13!">
                      <Table.Cell
                        className={cn(
                          "text-s font-normal lg:text-base",
                          isEditing ? "flex-[0.4]" : "flex-1"
                        )}
                      >
                        {isEditing ? (
                          <Input
                            value={origin.item}
                            onChange={(e) => form.setValue(`origins.${index}.item`, e.target.value)}
                            className="h-full! rounded-none! border-none! text-center"
                          />
                        ) : (
                          origin.item
                        )}
                      </Table.Cell>
                      <Table.Cell
                        className={cn(
                          "text-s font-normal lg:text-base",
                          isEditing ? "flex-[0.4]" : "flex-1"
                        )}
                      >
                        {isEditing ? (
                          <Input
                            value={origin.origin}
                            onChange={(e) =>
                              form.setValue(`origins.${index}.origin`, e.target.value)
                            }
                            className="h-full! rounded-none! border-none! text-center"
                          />
                        ) : (
                          origin.origin
                        )}
                      </Table.Cell>
                      {isEditing && (
                        <Table.Cell className="flex-[0.2]" onClick={() => handleDelete(origin.id)}>
                          <Trash className="text-primary size-4.5" />
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <div className="center h-35 flex-col gap-1 rounded-2xl border border-gray-600 bg-gray-700 lg:h-40 lg:rounded-xl">
                <span className="text-gray-0 text-sm font-medium lg:text-[15px]">
                  원산지가 등록되어 있지 않습니다.
                </span>
                <span className="lg:text-s text-xs font-normal text-[#505050]">
                  등록을 하시려면 수정 버튼을 눌러 추가해주세요.
                </span>
              </div>
            )}
          </form>
        </Form>
        {isEditing && (
          <Button
            color="black"
            variant="ghost"
            responsive
            responsiveButtons={{
              lg: {
                buttonSize: "md",
                className: "!h-10 border-2 border-dashed border-gray-300 rounded-xl",
              },
              md: { buttonSize: "sm", className: "border-dashed" },
              sm: { buttonSize: "sm", className: "border-dashed" },
            }}
            onClick={addOrigin}
          >
            <Plus className="size-7 text-gray-300" />
          </Button>
        )}
        <Button
          color="black"
          variant={isEditing ? "default" : "outline"}
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg", className: "text-lg !text-medium" },
            md: { buttonSize: "sm", className: "!h-8.5" },
            sm: { buttonSize: "sm", className: "!h-8.5" },
          }}
          onClick={() => {
            if (isEditing) {
              const origins = form.getValues("origins");

              for (const origin of origins) {
                const hasItem = origin.item.trim().length > 0;
                const hasOrigin = origin.origin.trim().length > 0;

                if ((hasItem && !hasOrigin) || (!hasItem && hasOrigin)) {
                  toast.error("품목과 원산지를 모두 입력해주세요.", {
                    position: "top-right",
                  });
                  return;
                }
              }

              const filteredOrigins = origins.filter(
                (origin) => origin.item.trim().length > 0 && origin.origin.trim().length > 0
              );

              // TODO: 저장 로직
              form.setValue("origins", filteredOrigins);
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
        >
          {!isEditing && <EditContained className="size-5 lg:size-6" />}
          {isEditing ? "저장하기" : "수정하기"}
        </Button>
      </div>
    </div>
  );
}

export default MainInfoPage;
