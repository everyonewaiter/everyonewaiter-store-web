import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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

  const handleSubmit = form.handleSubmit(() => {
    // TODO: 로그인 요청
  });

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
          onSubmit={handleSubmit}
        >
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
    </>
  );
}

export default LoginPage;
