import { Copy, FileUp, ShieldEllipsis } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { InputField } from "../components/ui/InputField";
import { PageTransition } from "../components/ui/PageTransition";
import { useAuth } from "../context/AuthContext";
import { issueCertificate } from "../services/api";
import type { IssueCertificatePayload } from "../types/certificate";

interface FormFields {
  studentFullName: string;
  studentId: string;
  nic: string;
  certificateSerialNumber: string;
  course: string;
}

const initialFields: FormFields = {
  studentFullName: "",
  studentId: "",
  nic: "",
  certificateSerialNumber: "",
  course: ""
};

export const AdminIssuePage = () => {
  const { logout } = useAuth();
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string>("");

  const hasMissingFields = useMemo(
    () => Object.values(fields).some((value) => !value.trim()) || !file,
    [fields, file]
  );

  const onFieldChange = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const onFile = (incomingFile: File | null) => {
    if (!incomingFile) {
      return;
    }

    if (incomingFile.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }

    setFile(incomingFile);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasMissingFields || !file) {
      toast.error("Please complete all fields and upload a PDF file.");
      return;
    }

    const payload: IssueCertificatePayload = {
      file,
      ...fields
    };

    setLoading(true);

    try {
      const pin = await issueCertificate(payload);
      setGeneratedPin(pin);
      toast.success("Certificate issued successfully.");
      setFields(initialFields);
      setFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Issuance failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onCopyPin = async () => {
    if (!generatedPin) {
      return;
    }

    await navigator.clipboard.writeText(generatedPin);
    toast.success("Generated password copied.");
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <GlassCard>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary-100 p-2 text-primary-700">
                <ShieldEllipsis className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Certificate Issuance Dashboard</h1>
                <p className="text-sm text-slate-600">Upload a PDF and register verifiable certificate metadata.</p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="h-11 border border-slate-200"
              onClick={() => {
                logout();
                toast.success("Logged out.");
              }}
            >
              Logout
            </Button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                id="studentFullName"
                label="Student Full Name"
                value={fields.studentFullName}
                onChange={(event) => onFieldChange("studentFullName", event.target.value)}
                placeholder="Jane Doe"
              />
              <InputField
                id="studentId"
                label="Student ID"
                value={fields.studentId}
                onChange={(event) => onFieldChange("studentId", event.target.value)}
                placeholder="STU-1024"
              />
              <InputField
                id="nic"
                label="NIC"
                hint="National ID"
                value={fields.nic}
                onChange={(event) => onFieldChange("nic", event.target.value)}
                placeholder="200012345678"
              />
              <InputField
                id="certificateSerialNumber"
                label="Certificate Serial Number"
                value={fields.certificateSerialNumber}
                onChange={(event) => onFieldChange("certificateSerialNumber", event.target.value)}
                placeholder="CERT-2026-001"
              />
            </div>

            <InputField
              id="course"
              label="Course"
              value={fields.course}
              onChange={(event) => onFieldChange("course", event.target.value)}
              placeholder="BSc Computer Science"
            />

            <label
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                dragOver ? "border-primary-500 bg-primary-50" : "border-slate-300 bg-slate-50"
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                onFile(event.dataTransfer.files?.[0] ?? null);
              }}
            >
              <FileUp className="mb-3 h-8 w-8 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Drag and drop PDF here or click to browse</span>
              <span className="mt-1 text-xs text-slate-500">Only application/pdf files are accepted</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => onFile(event.target.files?.[0] ?? null)}
              />
            </label>

            {file ? <p className="text-sm font-medium text-emerald-700">Selected file: {file.name}</p> : null}

            <Button type="submit" loading={loading} className="w-full md:w-auto">
              Issue Certificate
            </Button>
          </form>
        </GlassCard>

        {generatedPin ? (
          <GlassCard className="border-emerald-100 bg-emerald-50/80">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Generated Password / PIN</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="rounded-xl bg-white px-4 py-2 font-mono text-lg font-bold text-emerald-800">{generatedPin}</p>
              <Button variant="secondary" onClick={onCopyPin}>
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </GlassCard>
        ) : null}
      </div>
    </PageTransition>
  );
};
