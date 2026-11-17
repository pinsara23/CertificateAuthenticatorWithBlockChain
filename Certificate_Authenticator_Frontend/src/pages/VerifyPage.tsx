import { motion } from "framer-motion";
import { ShieldCheck, ShieldX, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { InputField } from "../components/ui/InputField";
import { PageTransition } from "../components/ui/PageTransition";
import { verifyCertificate } from "../services/api";
import type { VerifyState } from "../types/certificate";

export const VerifyPage = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>({ status: "idle" });

  const onVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!serialNumber.trim()) {
      setVerifyState({ status: "error", errorMessage: "Serial number is required." });
      return;
    }

    setVerifyState({ status: "loading" });

    try {
      const data = await verifyCertificate(serialNumber.trim());
      setVerifyState({ status: "success", data });
      toast.success(data.isValid ? "Certificate verified successfully" : "Certificate not found");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed.";
      setVerifyState({ status: "error", errorMessage: message });
      toast.error(message);
    }
  };

  const result = verifyState.status === "success" ? verifyState.data : undefined;

  return (
    <PageTransition>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary-700">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted On-Chain Verification
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Verify Academic Certificates Instantly
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Enter a serial number to validate certificate integrity against immutable blockchain records in seconds.
          </p>
        </motion.div>

        <GlassCard className="mx-auto w-full max-w-2xl">
          <form onSubmit={onVerify} className="space-y-4">
            <InputField
              id="verify-serial"
              label="Certificate Serial Number"
              hint="Case-sensitive"
              placeholder="Enter serial number"
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.target.value)}
            />
            <Button type="submit" loading={verifyState.status === "loading"} className="w-full">
              Verify Certificate
            </Button>
          </form>
        </GlassCard>

        {verifyState.status === "loading" ? (
          <GlassCard className="mx-auto w-full max-w-2xl animate-pulse space-y-3">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-3/4 rounded bg-slate-200" />
          </GlassCard>
        ) : null}

        {result ? (
          <GlassCard
            className={`mx-auto w-full max-w-2xl ${result.isValid ? "border-emerald-100 bg-emerald-50/50" : "border-rose-100 bg-rose-50/45"}`}
          >
            <div className="flex items-start gap-3">
              {result.isValid ? (
                <ShieldCheck className="mt-0.5 h-6 w-6 text-emerald-600" />
              ) : (
                <ShieldX className="mt-0.5 h-6 w-6 text-rose-600" />
              )}
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {result.isValid ? "Certificate is Authentic" : "Certificate is Not Valid"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  NIC: <span className="font-semibold text-slate-900">{result.nic ?? "N/A"}</span>
                </p>
              </div>
            </div>
          </GlassCard>
        ) : null}

        {verifyState.status === "error" ? (
          <p className="mx-auto w-full max-w-2xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {verifyState.errorMessage}
          </p>
        ) : null}
      </div>
    </PageTransition>
  );
};
