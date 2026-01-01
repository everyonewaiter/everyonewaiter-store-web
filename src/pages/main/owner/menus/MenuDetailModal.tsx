import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import logo from "@/assets/images/logo.svg";
import { Form, FormErrorMessage } from "@/components/form/Form";
import { Close } from "@/components/icons";
import { Dialog } from "@/components/overlay/Dialog";
import Button from "@/components/ui/Button/Button";
import Image from "@/components/ui/Image";
import cn from "@/lib/utils";
import MenuDetailForm from "@/pages/main/owner/menus/MenuDetailForm";
import MenuDetailOptions from "@/pages/main/owner/menus/MenuDetailOptions";
import { MENU_DETAILS_MOCK } from "@/pages/main/owner/menus/mock";
import { menuSchema, type MenuSchema } from "@/schema/menu.schema";
import type { MenuOptionGroupType } from "@/types/domain/menu";

type MenuDetailMode = "create" | "detail" | "edit";

interface MenuDetailModalProps {
  // menuId?: string;
  entry: "create" | "detail";
  isOpen: boolean;
  close: () => void;
}

function MenuDetailModal({ isOpen, close, entry }: Readonly<MenuDetailModalProps>) {
  const menu = MENU_DETAILS_MOCK[0];

  const [mode, setMode] = useState<MenuDetailMode>(entry === "create" ? "create" : "detail");

  const isEditing = mode === "edit";
  const isCreating = mode === "create";
  const isDetail = mode === "detail";

  const canEdit = isCreating || isEditing;

  const form = useForm<MenuSchema>({
    resolver: zodResolver(menuSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: isCreating
      ? {
          categoryId: "",
          name: "",
          description: "",
          price: "",
          spicy: 0,
          state: "DEFAULT",
          label: "DEFAULT",
          image: "",
          printEnabled: false,
          requiredOptionGroups: [],
          optionalOptionGroups: [],
        }
      : {
          categoryId: menu?.categoryId ?? "",
          name: menu?.name ?? "",
          description: menu?.description,
          price: String(menu?.price ?? 0),
          spicy: menu?.spicy ?? 0,
          state: menu?.state ?? "DEFAULT",
          label: menu?.label ?? "DEFAULT",
          image: menu?.image ?? "",
          printEnabled: menu?.printEnabled ?? false,
          requiredOptionGroups:
            menu?.menuOptionGroups.filter((group) => group.type === "MANDATORY") ?? [],
          optionalOptionGroups:
            menu?.menuOptionGroups.filter((group) => group.type === "OPTIONAL") ?? [],
        },
  });

  const [selectedGroup, setSelectedGroup] = useState<MenuOptionGroupType>("MANDATORY");

  const handleSubmit = form.handleSubmit(
    (data) => {
      if (isCreating) {
        // TODO: 메뉴 생성 로직 추가
        console.log(data);
      } else {
        // TODO: 메뉴 수정 로직 추가
        setMode("detail");
      }
    },
    (errors) => {
      console.log(errors);
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <Dialog.Wrapper className="w-[1344px]! max-w-full!" flexDirection="col">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log("Form submitted!", e);
              handleSubmit(e);
            }}
            className="flex flex-col gap-8"
          >
            <div className="flex justify-between">
              <div className="flex flex-1 flex-col gap-3">
                <h1 className="text-gray-0 text-2xl font-semibold">메뉴 정보</h1>
                <p className="text-sm font-normal text-gray-300">
                  메뉴의 세부 정보를 입력하고 옵션을 설정해 주세요.
                </p>
              </div>
              <Dialog.Close>
                <Close className="text-gray-0 size-8" />
              </Dialog.Close>
            </div>

            {/* 메뉴 이미지 등록 */}
            <div className="flex h-162 gap-4.5">
              <div className="flex w-[364px] flex-[0.28] flex-col gap-2">
                {menu?.image && (
                  <Image
                    src={menu?.image ?? ""}
                    alt={menu?.name ?? ""}
                    className="aspect-364/478 rounded-3xl"
                  />
                )}
                {(!menu?.image || isCreating) && (
                  <div
                    className={cn(
                      "center aspect-364/478 rounded-3xl border bg-gray-700",
                      form.formState.errors.image?.message
                        ? "border-status-error"
                        : "border-gray-600"
                    )}
                  >
                    <img src={logo} alt="logo" className="size-25 opacity-5 grayscale" />
                  </div>
                )}
                {isCreating && (
                  <Button
                    variant="outline"
                    color="black"
                    responsive
                    responsiveButtons={{
                      lg: { buttonSize: "sm" },
                    }}
                  >
                    이미지 등록
                  </Button>
                )}
                {/* TODO: 이미지 등록 로직 구현 */}
                <input type="file" hidden />
                {form.formState.errors.image && (
                  <FormErrorMessage>{form.formState.errors.image.message}</FormErrorMessage>
                )}
              </div>

              {/* 메뉴 정보 폼 */}
              <MenuDetailForm canEdit={canEdit} isDetail={isDetail} />

              {/* 메뉴 옵션 폼 */}
              <div className="flex min-h-0 flex-[0.35] flex-col gap-4.5">
                <MenuDetailOptions
                  type="MANDATORY"
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                  canEdit={canEdit}
                />
                <MenuDetailOptions
                  type="OPTIONAL"
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                  canEdit={canEdit}
                />
              </div>
            </div>

            <div className="flex w-full justify-center">
              {isDetail ? (
                <Button
                  color="black"
                  type="button"
                  responsive
                  responsiveButtons={{
                    lg: { buttonSize: "lg", className: "w-120" },
                  }}
                  onClick={() => setMode("edit")}
                >
                  수정하기
                </Button>
              ) : (
                <Button
                  type="submit"
                  responsive
                  responsiveButtons={{
                    lg: { buttonSize: "lg", className: "w-120" },
                  }}
                  onClick={() => console.log("button clicked!")}
                >
                  저장하기
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Dialog.Wrapper>
    </Dialog>
  );
}

export default MenuDetailModal;
