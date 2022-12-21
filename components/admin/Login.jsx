import { auth, store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginFormValues, loginValidator } from "@lib/validators";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import styles from "../../styles/modules/Admin.module.scss";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: loginFormValues,
    resolver: yupResolver(loginValidator),
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  useEffect(() => {
    const q = query(collection(store, "logins"), where("success", "==", false));
    return onSnapshot(q, (s) => {
      setFailedAttempts(s.docs.length);
    });
  }, []);

  const loginAdmin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const { code } = error;
      const colRef = collection(store, "logins");
      await addDoc(colRef, {
        code,
        success: false,
        time: Timestamp.fromDate(new Date()),
      });
    }
  };

  return (
    <div className={`container py-5 my-3 ${styles.login}`}>
      <h1 className="display-1 text-danger text-center">Restricted Module</h1>
      {failedAttempts < 5 ? (
        <form
          className={styles.login__form}
          onSubmit={handleSubmit(loginAdmin)}
        >
          <div className="form-floating w-50 mb-4">
            <input
              type="text"
              {...register("email")}
              className={`form-control form-control-sm ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="Email Address"
              autoFocus
            />
            <label>Email Address</label>
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
          <div className="form-floating w-50 mb-4">
            <input
              type="password"
              {...register("password")}
              className={`form-control form-control-sm ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder="Password"
              autoFocus
            />
            <label>Password</label>
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-lg w-50 btn-danger text-light"
          >
            Login
          </button>
        </form>
      ) : (
        <div className={`border-danger ${styles.login__form}`}>
          <h4 className="text-danger text-center">
            You have exceeded the number of allows failed login attempts.
            <br />
            The control module will be blocked until unlocked by the admin.
          </h4>
        </div>
      )}
    </div>
  );
}
