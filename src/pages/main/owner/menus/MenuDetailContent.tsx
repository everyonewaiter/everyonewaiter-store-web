import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { MENUS_KEY } from '@/api/menus/keys';
import { menuMutations } from '@/api/menus/mutations';
import logo from "@/assets/images/logo.svg";
import Spinner from '@/components/feedback/Spinner';
import { Form, FormErrorMessage } from "@/components/form/Form";
import { Close } from "@/components/icons";
import { Dialog } from "@/components/overlay/Dialog";
import Button from "@/components/ui/Button/Button";
import Image from "@/components/ui/Image";
import { errorResponse } from '@/lib/error-response';
import { queryClient } from '@/lib/query-client';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = mode === "edit";
  const isCreating = mode === "create";
  const isDetail = mode === "detail";

  const canEdit = (isCreating || isEditing) && !isSubmitting;

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
  
  const { mutate: createMenu } = useMutation(menuMutations.createMenu())
  const { mutate: updateMenu } = useMutation(menuMutations.updateMenu())
  const { mutate: updateMenuWithImage } = useMutation(menuMutations.updateMenuWithImage())

  const handleSubmit = () => {
    setIsSubmitting(true);
    const data = form.getValues();

    const payload = {
      ...data,
      price: Number(data.price?.replaceAll(',', '')),
      description: data.description ?? "",
      menuOptionGroups: [
        ...data.requiredOptionGroups.map((group) => ({
          ...group,
          menuOptions: group.menuOptions.map((option) => ({
            name: option.name,
            price: Number(option.price?.replaceAll(',', '')),
          })),
        })),
        ...data.optionalOptionGroups.map((group) => ({
          ...group,
          menuOptions: group.menuOptions.map((option) => ({
            name: option.name,
            price: Number(option.price?.replaceAll(',', '')),
          })),
        })),
      ],
    }

    if (isCreating) {
      createMenu({
        storeId: localStorage.getItem('storeId') as string,
        categoryId: form.getValues('categoryId'),
        data: {
          file: imageFile as File,
          request: payload,
        },
      }, {
        onSuccess: () => {
          toast.success('메뉴 생성이 완료되었습니다.');
          close()
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu })
        },
        onError: (error) => {
          setIsSubmitting(false);
          const { data } = errorResponse(error);

          if (data.code === 'EXCEED_MAXIMUM_MENU_COUNT') {
            form.setError('categoryId', { message: data.message });
            return;
          }

          if (data.code === 'INVALID_DISCOUNT_OPTION_PRICE') {
            form.setError('price', { message: data.message });
            return;
          }

          toast.error(data.message);
        },
      })
    } else {      
      if (menu?.image === data.image) {
        updateMenu({
          storeId: localStorage.getItem('storeId') as string,
          menuId: menu.menuId,
          data: payload,
        }, {
        onSuccess: () => {
          toast.success('메뉴 수정이 완료되었습니다.');
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menuDetail(menu.menuId) })
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu })
          close()
        },
          onError: (error) => {
            setIsSubmitting(false);
            toast.error(errorResponse(error).data.message)
          },
        })
      } else {
        updateMenuWithImage({
          storeId: localStorage.getItem('storeId') as string,
          menuId: menu.menuId,
          data: {
            file: imageFile as File,
            request: payload,
          },
        }, {
        onSuccess: () => {
          toast.success('메뉴 수정이 완료되었습니다.');
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menuDetail(menu.menuId) })
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu })
          close()
        },
          onError: (error) => {
            setIsSubmitting(false);
            toast.error(errorResponse(error).data.message)
          },
        })
      }
      setMode("detail");
    }
  };

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
                  className="aspect-320/373 rounded-xl md:aspect-240/280 lg:aspect-364/478 lg:rounded-3xl"
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
              {/* TODO: 이미지 등록 로직 구현 */}
              <input type="file" hidden />
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
              onClick={handleSubmit}
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
