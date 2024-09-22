import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signup } from "../redux/signupSlice";
import { useDispatch } from "react-redux";
import { FaRegEye } from "react-icons/fa";
const initialValues = {
  firstname: "",
  lastname: "",
  address: "",
  phone: "",
  gender: "",
  email: "",
  password: "",
  confirmpassword: "",
  avatar: "",
};
const handleValidate = Yup.object().shape({
  firstname: Yup.string().required("First name is required!"),
  lastname: Yup.string().required("Last name is required!"),
  address: Yup.string().required("Address is required!"),
  phone: Yup.number()
    .min(10, "phone Must be 10 Digits ")
    .required(" Phone is required!"),
  gender: Yup.string().required("Gender is Reduired!"),
  email: Yup.string().required("Email is Reduired!"),
  password: Yup.string().required("Password is Reduired!"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password not match!")
    .required("confirm Password is Reduired!"),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(initialValues);
  const fileInputRef = useRef(null); // Create a ref for the file input element
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handlesubmite = (values) => {
    console.log("values", values);
    const formData = new FormData();
    formData.append("firstname", values.firstname);
    formData.append("lastname", values.lastname);
    formData.append("address", values.address);
    formData.append("phone", values.phone);
    formData.append("gender", values.gender);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmpassword", values.confirmpassword);
    formData.append("avatar", values.avatar);
    console.log("formData", formData);
    dispatch(signup({ formData, navigate }));
  };

  return (
    <div className="container py-11">
      <div className="w-full  ">
        <h2 className="mb-3 text-center">Join us today!</h2>
        <p className="mb-4 text-center">Sign up now to become a user </p>
        <div className="flex justify-center items-center">
          <div className="w-1/4">
            <Formik
              initialValues={formValue}
              validationSchema={handleValidate}
              onSubmit={handlesubmite}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="mb-5 ">
                    <Field
                      type="text"
                      id="firstname"
                      name="firstname"
                      placeholder="First Name"
                      className="inputfiled"
                    />
                    <ErrorMessage
                      name="firstname"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-5 ">
                    <Field
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="Last Name"
                      className="inputfiled"
                    />
                    <ErrorMessage
                      name="lastname"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-5 ">
                    <Field
                      as="textarea"
                      id="address"
                      name="address"
                      placeholder="Address"
                      className="inputfiled"
                    />
                    <ErrorMessage
                      name="address"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-5 ">
                    <Field
                      type="number"
                      id="phone"
                      name="phone"
                      placeholder="Phone"
                      className="inputfiled"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-5 ">
                    <div>
                      <label className="me-3 ms-2 text-[#495057]">
                        <Field
                          type="radio"
                          name="gender"
                          value="male"
                          className="text-[#495057] border-[#D9DBDA]-500 border-2  "
                        />
                        Male
                      </label>
                      <label className="ms-2 text-[#495057]">
                        <Field
                          type="radio"
                          name="gender"
                          value="female"
                          className="text-[#495057] border-[#D9DBDA]-500 border-2"
                        />
                        Female
                      </label>
                    </div>
                    <ErrorMessage
                      name="gender"
                      component="p"
                      className="errorclass"
                    />
                  </div>
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
                  <div className="mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="avatar"
                      className="inputfiled"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("avatar", file);
                      }}
                    />
                    <ErrorMessage
                      name="avatar"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="buttonStyle ">
                      Signup
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <p className="text-center mt-5">
              Already user?
              <Link to="/login" className="text-sky-700 ms-2">
                Login Hear
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
