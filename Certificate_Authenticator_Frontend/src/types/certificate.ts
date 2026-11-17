export interface VerifyCertificateResponse {
  isValid: boolean;
  nic?: string;
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface LoginTokenResponse {
  token?: string;
  jwt?: string;
  accessToken?: string;
}

export type LoginResponseShape = string | LoginTokenResponse;

export interface VerifyState {
  status: "idle" | "loading" | "success" | "error";
  data?: VerifyCertificateResponse;
  errorMessage?: string;
}

export interface IssueCertificatePayload {
  file: File;
  studentFullName: string;
  studentId: string;
  nic: string;
  certificateSerialNumber: string;
  course: string;
}
