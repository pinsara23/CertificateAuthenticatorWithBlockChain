import { DownloadCloud, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { InputField } from "../components/ui/InputField";
import { PageTransition } from "../components/ui/PageTransition";
import { downloadCertificate } from "../services/api";

export const DownloadPage = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onDownload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!serialNumber.trim() || !password.trim()) {
      toast.error("Serial number and password are required.");
      return;
    }

    setLoading(true);

    try {
      await downloadCertificate(serialNumber.trim(), password);
      toast.success("Download started.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Download failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-xl">
        <GlassCard className="relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-primary-300/15 blur-2xl" />

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-primary-100 p-2 text-primary-700">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Student Download Portal</h1>
              <p className="text-sm text-slate-600">Enter your serial number and secure password to fetch your PDF.</p>
            </div>
          </div>

          <form onSubmit={onDownload} className="space-y-4">
            <InputField
              id="download-serial"
              label="Certificate Serial Number"
              hint="Provided by admin"
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.target.value)}
              placeholder="Enter serial number"
            />
            <InputField
              id="download-password"
              label="Certificate Password"
              hint="PIN or passphrase"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
            <Button type="submit" loading={loading} className="w-full">
              <DownloadCloud className="h-4 w-4" />
              Download Certificate
            </Button>
          </form>
        </GlassCard>
      </div>
    </PageTransition>
  );
};
