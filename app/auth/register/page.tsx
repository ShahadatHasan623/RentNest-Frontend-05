import { Suspense } from "react";
import RegisterForm from "../_actions/RegisterForm";
import AuthSkeleton from "../_actions/AuthSkelton";


const RegisterPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-muted/30 px-4 py-10">
      <Suspense fallback={<AuthSkeleton/>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
};

export default RegisterPage;