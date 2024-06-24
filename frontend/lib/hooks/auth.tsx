"use client";

import useSWR, { BareFetcher, KeyedMutator, SWRConfiguration } from "swr";
import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "../axios";
import { AxiosError } from "axios";
import {
  ForgotPasswordProps,
  LoginProps,
  RegisterProps,
  ResendEmailVerificationProps,
  ResetPasswordProps,
  User
} from "@/index";


export function useAuth({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware?: string;
  redirectIfAuthenticated?: string;
} = {}): {
  forgotPassword: ({setErrors, setStatus, email}: ForgotPasswordProps) => Promise<void>;
  login: ({setErrors, setStatus, ...props}: LoginProps) => Promise<void>;
  logout: () => Promise<void>;
  register: ({setErrors, ...props}: RegisterProps) => Promise<void>;
  resendEmailVerification: ({setStatus}: ResendEmailVerificationProps) => void;
  resetPassword: ({setErrors, setStatus, ...props}: ResetPasswordProps) => Promise<void>;
  user: undefined | User
} {
  const router = useRouter();
  const params = useParams();

  const config: SWRConfiguration<User, any, BareFetcher<User>> = {
    fetcher: async (url: string) => {
      try {
        const res = await axios.get(url);
        return res.data;
      } catch (error: any) {
        if ((error satisfies AxiosError).response?.status !== 409) {
          throw error;
        }

        router.push("/verify-email");
        return null;
      }
    },
  };

  const {
    data: user,
    error,
    mutate,
  }: {
    data: User | undefined;
    error: AxiosError | undefined;
    mutate: KeyedMutator<User>;
  } = useSWR<User>("/api/user", config);

  function csrf() {
    return axios.get("/sanctum/csrf-cookie");
  }

  async function register({ setErrors, ...props }: RegisterProps) {
    await csrf();

    setErrors([]);

    axios
      .post("/register", props)
      .then(() => mutate())
      .catch(
        (error: { response: { status: number; data: { errors: any } } }) => {
          if (error.response.status !== 422) throw error;

          setErrors(error.response.data.errors);
        }
      );
  }

  async function login({ setErrors, setStatus, ...props }: LoginProps) {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/login", props)
      .then(() => mutate())
      .catch(
        (error: { response: { status: number; data: { errors: any } } }) => {
          if (error.response.status !== 422) throw error;

          setErrors(error.response.data.errors);
        }
      );
  }

  async function forgotPassword({
    setErrors,
    setStatus,
    email,
  }: ForgotPasswordProps) {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response: { data: { status: string } }) =>
        setStatus(response.data.status)
      )
      .catch(
        (error: { response: { status: number; data: { errors: any } } }) => {
          if (error.response.status !== 422) throw error;

          setErrors(error.response.data.errors);
        }
      );
  }

  async function resetPassword({
    setErrors,
    setStatus,
    ...props
  }: ResetPasswordProps) {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then((response: { data: { status: string } }) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch(
        (error: { response: { status: number; data: { errors: any } } }) => {
          if (error.response.status !== 422) throw error;

          setErrors(error.response.data.errors);
        }
      );
  }

  function resendEmailVerification({
    setStatus,
  }: ResendEmailVerificationProps) {
    axios
      .post("/email/verification-notification")
      .then((response: { data: { status: any } }) =>
        setStatus(response.data.status)
      );
  }

  const logout = useCallback(async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  }, [error, mutate]);

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);

    if (
      window.location.pathname === "/verify-email" &&
      user?.email_verified_at
    ) {
      router.push(redirectIfAuthenticated || "/default-path");
    }

    if (middleware === "auth" && error) logout();
  }, [user, error, middleware, redirectIfAuthenticated, router, logout]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
}
