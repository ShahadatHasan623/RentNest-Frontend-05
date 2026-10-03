import { Suspense } from "react";
import LoginForm from "../_actions/LoginForm";


const LoginPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-muted/30 px-4 py-10">
      <Suspense fallback={<p>Loading login...</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
};

export default LoginPage;