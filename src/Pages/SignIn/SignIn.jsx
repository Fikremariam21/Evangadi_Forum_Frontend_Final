import React, { useContext, useState } from "react";
import "./SignIn.css";
import { userProvider } from "../../Context/UserProvider";
import axios from "../../API/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn({ toggleForm }) {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const [user, setUser] = useContext(userProvider);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function logIn(data) {
    setLoading(true);
    try {
      const response = await axios.post("/users/login", {
        password: data.password,
        email: data.email,
      });

      localStorage.setItem("token", response.data.token);
      const userData = {
        user_name: response.data.user_name,
        user_id: response.data.user_id,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 1000, // Closes after 1 sec
      });

      setTimeout(() => {
        navigate("/home");
      }, 1000);

      reset();
    } catch (error) {
      let errorMessage = "Something went wrong.";
      if (error.response) {
        const errorMessages = {
          400:
            error.response.data.msg ||
            "Invalid credentials. Check your email and password.",
          401: "Unauthorized access.",
          404: "Resource not found.",
          500: "Internal server error.",
        };
        errorMessage =
          errorMessages[error.response.status] ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login__container col-md">
      <ToastContainer />
      <h4>Login to your account</h4>
      <p>
        Don’t have an account?
        <Link className="create" onClick={toggleForm}>
          Create a new account
        </Link>
      </p>
      <form onSubmit={handleSubmit(logIn)}>
        <input
          type="text"
          className={errors.email ? "invalid" : ""}
          placeholder="  Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          onKeyUp={() => trigger("email")}
          style={{ padding: "5px" }}
        />

        <input
          type={passwordVisible ? "password" : "text"}
          className={`hide ${errors.password ? "invalid" : ""}`}
          placeholder="  Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Minimum password length is 8",
            },
          })}
          onKeyUp={() => trigger("password")}
          style={{ padding: "5px" }}
        />
        <div className="signinfas">
          <i
            onClick={togglePasswordVisibility}
            className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
          ></i>
        </div>

        <button
          className="login__signInButton"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default SignIn;
