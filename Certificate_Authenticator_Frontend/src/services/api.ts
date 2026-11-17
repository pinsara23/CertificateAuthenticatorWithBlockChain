import axios from "axios";
import { TOKEN_STORAGE_KEY } from "../context/AuthContext";
import type {
  AdminLoginPayload,
  IssueCertificatePayload,
  LoginResponseShape,
  VerifyCertificateResponse
} from "../types/certificate";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 15000
});

// Automatically adds JWT for protected requests when available.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getFriendlyError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Unable to reach backend. Check Spring Boot status and CORS configuration for http://localhost:5173.";
    }

    const responseData = error.response.data;
    const serverMessage =
      typeof responseData === "string"
        ? responseData
        : typeof responseData?.message === "string"
          ? responseData.message
          : "Request failed.";

    return `Error ${error.response.status}: ${serverMessage}`;
  }

  return "Unexpected error occurred.";
};

const getTokenFromResponse = (payload: LoginResponseShape): string => {
  if (typeof payload === "string") {
    return payload;
  }

  const token = payload.token ?? payload.jwt ?? payload.accessToken;

  if (!token) {
    throw new Error("Login succeeded but token was missing in response.");
  }

  return token;
};

export const loginAdmin = async (credentials: AdminLoginPayload): Promise<string> => {
  const params = {
    username: credentials.username.trim(),
    password: credentials.password
  };

  try {
    // Backend expects credentials as request params: /api/auth/login?username=...&password=...
    const response = await api.post<LoginResponseShape>("/api/auth/login", null, { params });

    return getTokenFromResponse(response.data);
  } catch (primaryError) {
    // Some Spring Security setups map login endpoint as GET or reject POST with params.
    try {
      const fallbackResponse = await api.get<LoginResponseShape>("/api/auth/login", { params });

      return getTokenFromResponse(fallbackResponse.data);
    } catch {
      throw new Error(getFriendlyError(primaryError));
    }
  }
};

export const verifyCertificate = async (serialNumber: string): Promise<VerifyCertificateResponse> => {
  try {
    const response = await api.get<VerifyCertificateResponse>("/api/certificate/verify", {
      params: { serialNumber }
    });
    return response.data;
  } catch (error) {
    throw new Error(getFriendlyError(error));
  }
};

export const downloadCertificate = async (serialNumber: string, password: string) => {
  try {
    const response = await api.get<Blob>("/api/certificate/download", {
      params: { serialNumber, password },
      responseType: "blob"
    });

    const disposition = response.headers["content-disposition"] ?? "";
    const fileNameMatch = disposition.match(/filename\*?=(?:UTF-8''|\")?([^;\"\n]+)/i);
    const fileName = fileNameMatch?.[1]
      ? decodeURIComponent(fileNameMatch[1].replace(/\"/g, ""))
      : `${serialNumber}-certificate.pdf`;

    const blobUrl = URL.createObjectURL(response.data);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    throw new Error(getFriendlyError(error));
  }
};

export const issueCertificate = async (payload: IssueCertificatePayload): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("studentFullName", payload.studentFullName);
    formData.append("studentId", payload.studentId);
    formData.append("nic", payload.nic);
    formData.append("certificateSerialNumber", payload.certificateSerialNumber);
    formData.append("course", payload.course);

    const response = await api.post<string>("/api/certificate/save", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(getFriendlyError(error));
  }
};
