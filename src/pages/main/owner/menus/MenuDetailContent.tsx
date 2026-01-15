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
import { menuSchema, type MenuSchema } from "@/schema/menu.schema";
import type { MenuDetail, MenuOptionGroupType } from "@/types/domain/menu";
import type { ModalProps } from "@/types/overlay";

type MenuDetailMode = "create" | "detail" | "edit";

interface MenuDetailContentProps extends ModalProps {
  entry: "create" | "detail";
  menu: MenuDetail;
  close: () => void;
}

function MenuDetailContent({ entry, menu, close }: Readonly<MenuDetailContentProps>) {
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
          printEnabled: true,
          requiredOptionGroups: [],
          optionalOptionGroups: [],
        }
      : {
          categoryId: menu?.categoryId ?? "",
          name: menu?.name ?? "",
          description: menu?.description,
          price: menu?.price ? menu.price.toLocaleString("ko-KR") : "",
          spicy: menu?.spicy ?? 0,
          state: menu?.state ?? "DEFAULT",
          label: menu?.label ?? "DEFAULT",
          image: menu?.image ?? "",
          printEnabled: menu?.printEnabled ?? true,
          requiredOptionGroups:
            menu?.menuOptionGroups
              .filter((group) => group.type === "MANDATORY")
              .map((group) => ({
                name: group.name,
                type: group.type,
                printEnabled: group.printEnabled,
                menuOptions: group.menuOptions.map((option) => ({
                  name: option.name,
                  price: option.price.toLocaleString("ko-KR"),
                })),
              })) ?? [],
          optionalOptionGroups:
            menu?.menuOptionGroups
              .filter((group) => group.type === "OPTIONAL")
              .map((group) => ({
                name: group.name,
                type: group.type,
                printEnabled: group.printEnabled,
                menuOptions: group.menuOptions.map((option) => ({
                  name: option.name,
                  price: option.price.toLocaleString("ko-KR"),
                })),
              })) ?? [],
        },
  });

  const [selectedGroup, setSelectedGroup] = useState<MenuOptionGroupType>("MANDATORY");

  const handleSubmit = form.handleSubmit(() => {
    if (isCreating) {
      // TODO: 메뉴 생성 로직 추가
      // TODO: 메뉴의 가격과 옵션의 가격을 number로 변경
    } else {
      // TODO: 메뉴 수정 로직 추가
      setMode("detail");
    }
  });

  return (
    <Form {...form}>
      <form id="menu-detail-form" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 lg:gap-8">
          <div className="flex justify-between">
            <div className="flex flex-1 flex-col gap-1 lg:gap-3">
              <Dialog.Title className="text-gray-0 text-lg font-semibold lg:text-2xl">
                메뉴 정보
              </Dialog.Title>
              <p className="text-xs font-normal text-gray-300 lg:text-sm">
                메뉴의 세부 정보를 입력하고 옵션을 설정해 주세요.
              </p>
            </div>
            <button type="button" onClick={close} className="hidden md:block">
              <Close className="text-gray-0 size-6" />
            </button>
          </div>

          <div className="flex w-full flex-col gap-4 md:h-114 md:flex-1 md:flex-row md:justify-between md:gap-2 lg:h-162 lg:gap-4.5">
            <div className="flex flex-col gap-1 md:flex-[0.29] lg:gap-2">
              {menu?.image && (
                <Image
                  src={menu?.image ?? ""}
                  alt={menu?.name ?? ""}
                  className="aspect-320/373 rounded-xl md:aspect-240/280 lg:aspect-364/478 lg:rounded-3xl"
                />
              )}
              {(!menu?.image || isCreating) && (
                <div
                  className={cn(
                    "center aspect-320/373 rounded-xl border bg-gray-700 md:aspect-240/280 lg:aspect-364/478 lg:rounded-3xl",
                    form.formState.errors.image?.message ? "border-status-error" : "border-gray-600"
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
                    lg: { buttonSize: "sm", className: "border-gray-300!" },
                    md: {
                      buttonSize: "md",
                      className: "h-8! rounded-lg! border-gray-300! text-xs! font-normal!",
                    },
                    sm: {
                      buttonSize: "md",
                      className: "h-8! rounded-lg! border-gray-300! text-xs! font-normal!",
                    },
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
            <div className="hide-scrollbar flex w-full flex-col gap-3 overflow-y-auto rounded-xl border border-gray-600 p-4 md:flex-[0.33] lg:gap-4 lg:rounded-3xl lg:p-6">
              <MenuDetailForm canEdit={canEdit} isDetail={isDetail} />
            </div>

            {/* 메뉴 옵션 폼 */}
            <div className="flex min-h-0 w-full flex-col gap-3 md:flex-[0.36] md:gap-4.5">
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
        </div>
        <div className="-bottom-5 flex w-full justify-center bg-white pb-5 md:sticky md:z-10 md:pt-5 lg:relative lg:pt-10 lg:pb-0">
          {isDetail ? (
            <Button
              color="black"
              type="button"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "lg", className: "w-120" },
                md: { buttonSize: "sm", className: "w-73" },
                sm: { buttonSize: "sm", className: "w-full" },
              }}
              onClick={() => setMode("edit")}
            >
              수정하기
            </Button>
          ) : (
            <Button
              type="submit"
              form="menu-detail-form"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "lg", className: "w-120" },
                md: { buttonSize: "sm", className: "w-73" },
                sm: { buttonSize: "sm", className: "w-full h-10!" },
              }}
            >
              저장하기
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export default MenuDetailContent;
