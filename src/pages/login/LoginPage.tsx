import { useLayoutEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import loginBg from "@/assets/images/login-bg.png";
import logoTextHorizontal from "@/assets/images/logo-text-horizontal.svg";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/Button/Button";
import { loginSchema, type LoginSchema } from "@/schema/auth/login.schema";

function LoginPage() {
  const form = useForm<LoginSchema>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useLayoutEffect(() => {
    const img = new Image();
    img.src = loginBg;
  }, []);

  const handleSubmit = form.handleSubmit(() => {
    // TODO: 로그인 요청
  });

  return (
    <div className="flex h-dvh w-dvw items-center overflow-hidden md:pl-6 lg:pl-15">
      <div className="center w-full flex-col gap-10 px-5 md:px-15.5 md:py-8 lg:gap-12 lg:px-28.5 lg:py-16">
        <img
          src={logoTextHorizontal}
          alt="logo text horizontal"
          className="w-40 max-w-50 md:w-[37%]"
        />
        <Form {...form}>
          <form className="w-full flex-col" onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col gap-3 lg:mb-8 lg:gap-4">
              <FormField
                control={form.control}
                name="email"
                label="이메일"
                inputProps={{ placeholder: "이메일을 입력해주세요." }}
              />
              <FormField
                control={form.control}
                name="password"
                label="비밀번호"
                inputProps={{ placeholder: "비밀번호를 입력해주세요.", type: "password" }}
              />
            </div>
            <div className="flex flex-col justify-center gap-4 lg:gap-5">
              <Button
                type="submit"
                color="primary"
                responsive
                responsiveButtons={{
                  sm: { buttonSize: "sm" },
                  md: { buttonSize: "sm" },
                  lg: { buttonSize: "lg" },
                }}
              >
                로그인
              </Button>
              <p className="text-s text-center text-gray-300 lg:text-sm">
                계정이 없으신가요? 간편하게{" "}
                <Link
                  to="/signup"
                  className="text-primary underline underline-offset-3 lg:underline-offset-5"
                >
                  회원가입
                </Link>
                을 할 수 있어요!
              </p>
            </div>
          </form>
        </Form>
      </div>
      <div className="hidden h-full md:block md:aspect-488/568 md:p-4 lg:aspect-1200/1080 lg:p-6">
        <img
          src={loginBg}
          alt="login background"
          loading="eager"
          fetchPriority="high"
          aria-label="login background"
          className="h-full w-full object-cover md:rounded-3xl"
        />
      </div>
    </div>
  );
}

export default LoginPage;
