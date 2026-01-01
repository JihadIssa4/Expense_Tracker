import SignupForm from "../components/auth/RegisterForm";
function Signup() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-[var(--text-primary)] flex items-center justify-center p-6">
      <SignupForm></SignupForm>
    </div>
  );
}
export default Signup;
