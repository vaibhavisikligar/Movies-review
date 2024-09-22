import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../redux/loginSlice";
import { useDispatch } from "react-redux";

const initialValues = {
  email: "",
};
const handlevalidate = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
});
const ForgotPassword = () => {
  const [email, setEmail] = useState(initialValues);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (values) => {
    const { email } = values;
    console.log("email", email);
    dispatch(forgotPassword({ email, navigate }));
  };
  return (
    <div className="container py-11">
      <div className="w-full py-11 ">
        <h2 className="mb-3 text-center">Forgot Password</h2>
        <p className="mb-4 text-center">Please enter your email below</p>
        <div className="flex justify-center items-center">
          <div className="w-1/4">
            <Formik
              initialValues={email}
              validationSchema={handlevalidate}
              onSubmit={handleSubmit}
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

                <div className="text-center">
                  <button type="submit" className="buttonStyle ">
                    send
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

export default ForgotPassword;
