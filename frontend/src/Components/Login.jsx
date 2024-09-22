import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/loginSlice";
import { useDispatch } from "react-redux";
import { FaRegEye } from "react-icons/fa";
import * as Yup from "yup";
const initialValues = {
  email: "",
  password: "",
};
const handlevalidate = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is Reduired!"),
});
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState(initialValues);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlesubmite = (values) => {
    dispatch(login({ values, navigate }));
  };

  return (
    <div className="container py-11">
      <div className="w-full  ">
        <h2 className="mb-3 text-center">Welcome back!</h2>
        <p className="mb-4 text-center">Login in to access your account! </p>
        <div className="flex justify-center items-center">
          <div className="w-1/4">
            <Formik
              initialValues={loginValue}
              validationSchema={handlevalidate}
              onSubmit={handlesubmite}
            >
              <Form>
                <div className="mb-5 ">
                  <Field
                    type="email"
                    name="email"
                    className="inputfiled"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="errorclass"
                  />
                </div>
                <div className="mb-5 ">
                  <div className="flex items-center relative ">
                    <Field
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      className="inputfiled"
                      placeholder="Password"
                    />
                    <button
                      className="absolute top-3.5 right-3"
                      onClick={togglePasswordVisibility}
                    >
                      <FaRegEye />
                    </button>
                  </div>
                  <div className="mt-3 text-right text-sky-700">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="errorclass"
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="buttonStyle ">
                    Login
                  </button>
                </div>
              </Form>
            </Formik>
            <p className="text-center mt-5">
              Not user?
              <Link to="/signup" className="text-sky-700 ms-2">
                Signup Hear
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
