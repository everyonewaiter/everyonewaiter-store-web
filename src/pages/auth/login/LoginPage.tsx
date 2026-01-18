import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { accountMutations } from "@/api/account/mutations";
import logoTextVertical from "@/assets/images/logo-text-vertical.svg";
import Spinner from "@/components/feedback/Spinner";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/Button/Button";
import { errorResponse } from "@/lib/error-response";
import { loginSchema, type LoginSchema } from "@/schema/auth/login.schema";

function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login } = useMutation(accountMutations.signIn());

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit((values: LoginSchema) => {
    setIsSubmitting(true);

    login(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.accessToken);
          navigate("/");
        },
        onError: (error) => {
          setIsSubmitting(false);
          const { status, data } = errorResponse(error);
          const code = data?.code;
          const message = data?.message;

          if (code === "NOT_COMPLETE_EMAIL_VERIFICATION") {
            toast.error(message);
            navigate("/auth/mail?type=not-verified");
            return;
          }

          if (status === 400 || code === "FAILED_SIGN_IN") {
            form.setError("email", { message });
            form.setError("password", { message });
            return;
          }

          toast.error(message || "로그인 중 오류가 발생했습니다.");
        },
      }
    );
  });

  return (
    <>
      <img src={logoTextVertical} alt="logo text vertical" className="w-40 max-w-50 md:w-[37%]" />
      <Form {...form}>
        <form className="flex flex-col gap-3 md:w-73 lg:w-108 lg:gap-4" onSubmit={handleSubmit}>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "로그인"}
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
