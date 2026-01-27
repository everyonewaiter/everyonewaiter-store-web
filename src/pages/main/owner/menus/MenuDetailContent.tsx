import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import logo from "@/assets/images/logo.svg";
import Spinner from '@/components/feedback/Spinner';
import { Form, FormErrorMessage } from "@/components/form/Form";
import { Close } from "@/components/icons";
import { Dialog } from "@/components/overlay/Dialog";
import Button from "@/components/ui/Button/Button";
import Image from "@/components/ui/Image";
import useMenuFormSubmit from '@/hooks/menu/useMenuFormSubmit';
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
  initialCategoryId?: string;
}

function MenuDetailContent({
  entry,
  menu,
  close,
  initialCategoryId,
}: Readonly<MenuDetailContentProps>) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<MenuDetailMode>(entry === "create" ? "create" : "detail");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditing = mode === "edit";
  const isCreating = mode === "create";
  const isDetail = mode === "detail";

  const form = useForm<MenuSchema>({
    resolver: zodResolver(menuSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      categoryId: initialCategoryId ?? "",
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
    },
  });

  useEffect(() => {
    if (menu?.menuId) {
      form.reset({
        ...menu,
        price: menu?.price ? menu.price.toLocaleString("ko-KR") : "",
        requiredOptionGroups:
        menu?.menuOptionGroups
            .filter((group) => group.type === "MANDATORY")
            .map((group) => ({
              ...group,
              menuOptions: group.menuOptions.map((option) => ({
                name: option.name,
                price: option.price.toLocaleString("ko-KR"),
              })),
        })) ?? [],
        optionalOptionGroups:
          menu?.menuOptionGroups
            .filter((group) => group.type === "OPTIONAL")
            .map((group) => ({
              ...group,
              menuOptions: group.menuOptions.map((option) => ({
                name: option.name,
                price: option.price.toLocaleString("ko-KR"),
              })),
          })) ?? [],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu])

  const [selectedGroup, setSelectedGroup] = useState<MenuOptionGroupType>("MANDATORY");

  const { isSubmitting, handleSubmit } = useMenuFormSubmit({
    form,
    menu,
    isCreating,
    close,
  });

  const canEdit = (isCreating || isEditing) && !isSubmitting;


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {            
      const previewUrl = URL.createObjectURL(file);
      form.setValue('image', previewUrl);
      setImageFile(file);
    }
  };

  if (!isCreating && !menu?.menuId) return null;

  return (
    <Form {...form}>
      <div className="flex h-full flex-col gap-5 lg:gap-8">
        <div className="shrink-0">
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
        </div>

        <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-5 md:overflow-y-auto lg:flex-none lg:overflow-y-hidden lg:gap-8">
          <div className="flex w-full flex-col gap-4 md:flex-1 md:flex-row md:justify-between md:gap-2 lg:h-162 lg:gap-4.5">
            <div className="flex flex-col gap-1 md:flex-[0.29] lg:gap-2">
              {menu?.image && !isCreating && (
                <Image
                  src={menu?.image ?? ""}
                  alt={menu?.name ?? ""}
                  className="h-auto aspect-320/373 rounded-xl md:aspect-240/280 lg:aspect-364/478 lg:rounded-3xl object-cover"
                  hasBlur
                />
              )}
              {(!menu?.image && !form.watch('image') && isCreating) && (
                <div
                  className={cn(
                    "center aspect-320/373 rounded-xl border bg-gray-700 md:aspect-240/280 lg:aspect-364/478 lg:rounded-3xl",
                    form.formState.errors.image?.message ? "border-status-error" : "border-gray-600"
                  )}
                >
                  <img src={logo} alt="logo" className="size-25 opacity-5 grayscale" />
                </div>
              )}
              {imageFile && (
                <img src={form.watch('image')} alt="메뉴 이미지 미리보기" className="aspect-320/373 rounded-xl object-cover md:aspect-240/280 lg:aspect-364/478 lg:rounded-3xl" />
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
                  onClick={() => imageRef.current?.click()}
                  disabled={isSubmitting}
                >
                  이미지 등록
                </Button>
              )}
              <input type="file" accept="image/png, image/jpg, image/jpeg" hidden onChange={handleImageChange} ref={imageRef} />
              {form.formState.errors.image && (
                <FormErrorMessage>{form.formState.errors.image.message}</FormErrorMessage>
              )}
            </div>

            {/* 메뉴 정보 폼 */}
            <div className="h-fit  flex w-full flex-col gap-3 rounded-xl border border-gray-600 p-4 md:flex-[0.33] lg:gap-4 lg:rounded-3xl lg:p-6">
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
        <div className="shrink-0 -bottom-5 flex w-full justify-center bg-white pb-5 md:sticky md:z-10 md:pt-5 lg:relative lg:p-0">
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
              type="button"
              form="menu-detail-form"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "lg", className: "w-120" },
                md: { buttonSize: "sm", className: "w-73" },
                sm: { buttonSize: "sm", className: "w-full h-10!" },
              }}
              disabled={isSubmitting}
              onClick={() => handleSubmit(imageFile)}
            >
              {isSubmitting ? <Spinner /> : "저장하기"}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}

export default MenuDetailContent;
