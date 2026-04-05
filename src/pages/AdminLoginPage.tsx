import { ShieldCheck, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { InputField } from "../components/ui/InputField";
import { PageTransition } from "../components/ui/PageTransition";
import { useAuth } from "../context/AuthContext";
import { loginAdmin } from "../services/api";

interface LoginFields {
  username: string;
  password: string;
}

const initialFields: LoginFields = {
  username: "",
  password: ""
};

export const AdminLoginPage = () => {
  const [fields, setFields] = useState<LoginFields>(initialFields);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nextPath = (location.state as { from?: string } | null)?.from ?? "/admin/issue";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fields.username.trim() || !fields.password.trim()) {
      toast.error("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const token = await loginAdmin({
        username: fields.username.trim(),
        password: fields.password
      });

      login(token);
      toast.success("Administrator authenticated.");
      navigate(nextPath, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-md">
        <GlassCard className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary-300/20 via-indigo-300/15 to-white" />

          <div className="relative mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-primary-100 p-2 text-primary-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Control Access</h1>
              <p className="text-sm text-slate-600">Authenticate to access certificate issuance controls.</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <InputField
              id="admin-username"
              label="Username"
              placeholder="admin"
              autoComplete="username"
              value={fields.username}
              onChange={(event) => setFields((prev) => ({ ...prev, username: event.target.value }))}
            />
            <InputField
              id="admin-password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={fields.password}
              onChange={(event) => setFields((prev) => ({ ...prev, password: event.target.value }))}
            />

            <Button type="submit" loading={loading} className="w-full">
              <UserRound className="h-4 w-4" />
              Enter Dashboard
            </Button>
          </form>
        </GlassCard>
      </div>
    </PageTransition>
  );
};
