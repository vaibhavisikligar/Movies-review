import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { resetPassword } from "../redux/loginSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const initialValues = {
  password: "",
  confirmpassword: "",
};
const handlevalidate = Yup.object().shape({
  password: Yup.string().required("Password is Reduired!"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password not match!")
    .required("confirm Password is Reduired!"),
});
const ResetPassword = () => {
  const { id: _id, token } = useParams();
  const [formvalue, setformvalue] = useState(initialValues);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = (values) => {
    const { password, confirmpassword } = values;

    dispatch(resetPassword({ password, confirmpassword, _id, token }));
  };
  return (
    <div className="container py-11">
      <div className="w-full py-11 ">
        <h2 className="mb-3 text-center">Reset Password</h2>
        <p className="mb-4 text-center">
          If you want to reset your password,
          <br />
          Please enter your new password below.
        </p>
        <div className="flex justify-center items-center">
          <div className="w-1/4">
            <Formik
              initialValues={formvalue}
              validationSchema={handlevalidate}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="mb-5 ">
                  <div className="relative flex items-center">
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

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="errorclass"
                  />
                </div>
                <div className="mb-5 ">
                  <div className="flex items-center relative">
                    <Field
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirmpassword"
                      className="inputfiled"
                      placeholder="confirmpassword"
                    />
                    <button
                      className="absolute top-3.5 right-3"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      <FaRegEye />
                    </button>
                  </div>

                  <ErrorMessage
                    name="confirmpassword"
                    component="p"
                    className="errorclass"
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="buttonStyle ">
                    Update
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
