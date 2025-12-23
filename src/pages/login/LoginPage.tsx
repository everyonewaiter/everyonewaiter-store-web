import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import Button from '@/components/ui/Button/Button';
import { Link } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { loginSchema, type LoginSchema } from '@/schema/auth/login.schema';
import loginBg from '../../assets/images/login-bg.png';
import logoTextHorizontal from '../../assets/images/logo-text-horizontal.svg';

function LoginPage() {
	const form = useForm<LoginSchema>({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	useLayoutEffect(() => {
		const img = new Image();
		img.src = loginBg;
	}, []);

	const handleSubmit = form.handleSubmit(data => {
		// eslint-disable-next-line no-console
		console.log(data);
		// TODO: 로그인 요청
	})

	return (
		<div className='w-dvw h-dvh flex items-center md:pl-[24px] lg:pl-[60px] overflow-hidden'>
			<div className='w-full flex-col center px-5 md:px-[62px] md:py-[32px] lg:px-[114px] lg:py-[64px] gap-10 lg:gap-12'>
				<img src={logoTextHorizontal} alt="logo text horizontal" className='w-[160px] md:w-[37%] max-w-[200px]' />
				<Form {...form}>
					<form className='w-full flex-col' onSubmit={handleSubmit}>
						<div className='flex flex-col gap-3 lg:gap-4 mb-6 lg:mb-8'>
							<FormField
								control={form.control}
								name="email"
								label="이메일"
								inputProps={{ placeholder: '이메일을 입력해주세요.' }}
							/>
							<FormField
								control={form.control}
								name="password"
								label="비밀번호"
								inputProps={{ placeholder: '비밀번호를 입력해주세요.', type: 'password' }}
							/>
						</div>
						<div className="flex flex-col gap-4 lg:gap-5 justify-center">
							<Button type="submit" color="primary" responsive responsiveButtons={{
								sm: { buttonSize: 'sm' },
								md: { buttonSize: 'sm' },
								lg: { buttonSize: 'lg' }
							}}>로그인</Button>
							<p className="text-center text-s lg:text-sm text-gray-300">계정이 없으신가요? 간편하게 <Link to="/signup" className="text-primary underline underline-offset-3 lg:underline-offset-5">회원가입</Link>을 할 수 있어요!</p>
						</div>
					</form>
				</Form>
			</div>
			<div className='hidden md:block md:aspect-488/568 lg:aspect-1200/1080 h-full md:p-4 lg:p-6'>
				<img
					src={loginBg}
					alt="login background"
					loading="eager"
					fetchPriority="high"
					aria-label="login background"
					className='w-full h-full object-cover md:rounded-3xl'
				/>
			</div>
		</div>
	)
}

export default LoginPage;