import { useFieldArray, useFormContext } from "react-hook-form";
import { FormErrorMessage } from "@/components/form/Form";
import { Trash } from "@/components/icons";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import cn from "@/lib/utils";
import type { StoreInfoSchema } from "@/schema/store-info.schema";

interface InfoOriginBoxProps {
  isEditing: boolean;
}

function InfoOriginBox({ isEditing }: Readonly<InfoOriginBoxProps>) {
  const form = useFormContext<StoreInfoSchema>();

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "origins",
  });

  return (
    <>
      {fields.length > 0 ? (
        <Table
          containerClassName={cn(
            "rounded-xl border border-gray-600 overflow-hidden",
            form.formState.errors.origins ? "border-primary" : ""
          )}
        >
          <Table.Header className="h-10 rounded-none lg:h-13">
            <Table.Row>
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
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {fields.map((field, index) => (
              <Table.Row key={field.id} className="flex h-10 lg:h-13!">
                <Table.Cell
                  className={cn(
                    "text-s font-normal lg:text-base",
                    isEditing ? "flex-[0.4]" : "flex-1"
                  )}
                >
                  {isEditing ? (
                    <Input
                      {...form.register(`origins.${index}.item`)}
                      className="h-full! rounded-none! border-none! text-center"
                    />
                  ) : (
                    field.item
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
                      {...form.register(`origins.${index}.origin`)}
                      className="h-full! rounded-none! border-none! text-center"
                    />
                  ) : (
                    field.origin
                  )}
                </Table.Cell>
                {isEditing && (
                  <Table.Cell className="flex-[0.2]" onClick={() => remove(index)}>
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
      <FormErrorMessage>{form.formState.errors.origins?.message}</FormErrorMessage>
    </>
  );
}

export default InfoOriginBox;
