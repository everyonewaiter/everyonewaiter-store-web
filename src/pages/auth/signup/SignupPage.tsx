import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logoTextHorizontal from "@/assets/images/logo-text-horizontal.svg";
import { Form, FormErrorMessage } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox";
import { signupSchema, type SignupSchema } from "@/schema/auth/signup.schema";

function SignupPage() {
  const navigate = useNavigate();

  const form = useForm<SignupSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      authCode: "",
      password: "",
      passwordConfirm: "",
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0] as keyof SignupSchema;
      form.setFocus(firstErrorField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.errors]);

  const onSubmit = () => {
    // TODO: 회원가입 로직 구현
    navigate("/signup/loading");
  };

  return (
    <>
      <img
        src={logoTextHorizontal}
        alt="logo text horizontal"
        className="w-40 max-w-50 md:w-[37%]"
      />
      <Form {...form}>
        <form
          className="flex flex-col gap-3 md:w-[292px] lg:w-[432px] lg:gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            label="이메일"
            inputProps={{ placeholder: "이메일을 입력해주세요." }}
            description="이메일 인증을 위해 정확한 이메일을 입력해주세요!"
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            label="휴대폰 번호"
            inputProps={{ placeholder: "휴대폰 번호를 입력해주세요. (-없이 숫자만 입력)" }}
            postfix={
              <Button
                color="black"
                responsive
                responsiveButtons={{
                  lg: { buttonSize: "lg", className: "w-[100px]" },
                  md: { buttonSize: "sm", className: "w-[88px]" },
                }}
              >
                인증요청
              </Button>
            }
          />
          <FormField
            control={form.control}
            name="authCode"
            label=""
            inputProps={{
              placeholder: "인증번호를 입력해주세요.",
              suffix: (
                <span className="text-s font-normal text-gray-200 lg:text-[15px]">01:00</span>
              ),
            }}
            postfix={
              <Button
                color="black"
                responsive
                responsiveButtons={{
                  lg: { buttonSize: "lg", className: "w-[100px]" },
                  md: { buttonSize: "sm", className: "w-[88px]" },
                }}
              >
                확인
              </Button>
            }
          />
          <FormField
            control={form.control}
            name="password"
            label="비밀번호"
            inputProps={{ placeholder: "비밀번호를 입력해주세요.", type: "password" }}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            label="비밀번호 확인"
            inputProps={{ placeholder: "비밀번호를 다시 입력해주세요.", type: "password" }}
          />
          <div className="mt-1 flex flex-col gap-2 md:mt-0">
            <div className="flex flex-col gap-5 rounded-[10px] border border-gray-600 p-4 lg:gap-6">
              <span className="text-s leading-[150%] font-normal text-[#767676]">
                회원가입을 통해 수집한 회원의 정보는 서비스 제공에 관한 계약 성립 및 이행(회원 및
                본인식 및 본인의사 확인 등), 새로운 기능 정보 안내(제공), 회원 관리(불만처리 등
                민원처리, 고지사항 전달 등)의 목적으로 수집되어 이용됩니다. 또한, 이용자의
                개인정보는 제3자에게 제공되지 않으며, 수집 및 이용목적이 달성된 후에는 지체 없이
                파기됩니다.
              </span>
              <div className="flex items-center gap-2">
                <Checkbox
                  hasError={!!form.formState.errors.agreeToTerms}
                  onCheckedChange={(checked: boolean) => form.setValue("agreeToTerms", checked)}
                />
                <span className="text-gray-0 text-s font-normal lg:text-sm">
                  개인정보 수집에 동의합니다. (필수)
                </span>
              </div>
            </div>
            <FormErrorMessage>{form.formState.errors.agreeToTerms?.message}</FormErrorMessage>
          </div>
          <Button
            type="submit"
            responsive
            responsiveButtons={{
              lg: { buttonSize: "lg", className: "mt-3" },
              md: { buttonSize: "md", className: "mt-2" },
              sm: { buttonSize: "sm", className: "mt-2" },
            }}
            disabled={!useWatch({ control: form.control, name: "agreeToTerms" })}
          >
            가입하기
          </Button>
        </form>
      </Form>
    </>
  );
}

export default SignupPage;
