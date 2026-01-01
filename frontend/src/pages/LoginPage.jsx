import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-[var(--text-primary)] flex items-center justify-center p-6">
      <LoginForm></LoginForm>
    </div>
  );
}
export default Login;
