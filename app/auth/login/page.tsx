import { Suspense } from "react";
import LoginForm from "../_actions/LoginForm";
import LoginFormSkeleton from "../_actions/loginSkelton";


const LoginPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-muted/30 px-4 py-10">
      <Suspense fallback={<LoginFormSkeleton/>}>
        <LoginForm />
      </Suspense>
    </main>
  );
};

export default LoginPage;