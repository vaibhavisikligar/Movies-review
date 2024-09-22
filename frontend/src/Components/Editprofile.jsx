import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import adminProfile from "../img/adminProfile.png";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/loginSlice";
import { updateUser } from "../redux/loginSlice";
import toast, { Toaster } from "react-hot-toast";

const initialValues = {
  firstname: "",
  lastname: "",
  address: "",
  phone: "",
  gender: "",
  email: "",
  avatar: "",
  dob: new Date(),
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
  avatar: Yup.string().required("Avatar is required!"),
  dob: Yup.date()
    .typeError("Invalid date")
    .required("Date of Birth is required!"),
});

const Editprofile = () => {
  const { userlist } = useSelector((state) => state.login);
  const [formValue, setFormValue] = useState(initialValues);
  const fileInputRef = useRef(null); // Create a ref for the file input element
  const [imagePreview, setImagePreview] = useState();
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/signUp", {
        method: "GET",
        headers: {
          authorization: token,
        },
      });
      const data = await response.json();
      // console.log("data::", data);
      dispatch(setUser(data.data));
      if (data.data) {
        const {
          _id,
          firstname,
          lastname,
          address,
          phone,
          gender,
          email,
          dob,
          avatar,
        } = data.data;
        setFormValue({
          _id,
          firstname: firstname || "",
          lastname: lastname || "",
          address: address || "",
          phone: phone || "",
          gender: gender || "", // Set the gender received from the API
          email: email || "",
          avatar: avatar || "", // Handle avatar URL or file differently
          dob: dob ? new Date(dob) : new Date(), // Convert to Date object
        });
        setImagePreview(avatar || adminProfile);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch, imagePreview]);

  const handlesubmite = async (values) => {
    const formData = new FormData();
    formData.append("firstname", values.firstname);
    formData.append("lastname", values.lastname);
    formData.append("address", values.address);
    formData.append("phone", values.phone);
    formData.append("gender", values.gender);
    formData.append("email", values.email);
    formData.append("dob", values.dob.toISOString().substr(0, 10)); // Convert to string
    formData.append("avatar", values.avatar); // Append file directly

    // console.log(...formData); // Spread to see form data
    dispatch(updateUser({ id: values._id, formData, dispatch }));
    toast.success("user updated successfully");
    getUser();
  };

  return (
    <div className="container py-6">
      <Toaster />
      <h2 className="mb-3 text-center ">Edit UserProfile</h2>
      <div className="w-full flex items-start justify-between flex-col lg:flex-row  py-5 gap-3">
        <div className="lg:w-1/4 w-full    ">
          <div className="block w-full  p-6 rounded-lg shadow bg-gray-600 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className=" mb-4 w-52	h-52 md:w-40	md:h-40	lg:w-36	 lg:h-36	 rounded-full border-white border-2 flex justify-center items-center object-cover">
                {imagePreview ? (
                  <img
                    src={`http://localhost:8080/api/signUp/upload/${userlist.avatar}`} // Use imagePreview state here
                    alt="Preview"
                    className="w-full h-full rounded-full bg-white"
                  />
                ) : (
                  <img
                    src={adminProfile}
                    alt="Preview"
                    className="w-full h-full rounded-full bg-white"
                  />
                )}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">
                {userlist.firstname}
              </h3>
              <h4 className="text-md text-gray-400">{userlist.email}</h4>
            </div>
          </div>
        </div>
        <div className="lg:w-3/4 w:full 	">
          <div className="block w-full lg:w-9/12	 p-6  rounded-lg shadow bg-gray-600  dark:border-gray-700 ">
            <Formik
              initialValues={formValue}
              validationSchema={handleValidate}
              enableReinitialize="true"
              onSubmit={handlesubmite}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="flex  items-center gap-2 flex-col md:flex-row ">
                    <div className="mb-5 md:w-1/2	w-full ">
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
                    <div className="mb-5 md:w-1/2 w-full	 ">
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
                  </div>
                  <div className="flex  items-center gap-2 flex-col md:flex-row ">
                    <div className="mb-5 md:w-1/2 w-full	 ">
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
                    <div className="mb-3 md:w-1/2	w-full">
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="avatar"
                        className="inputfiled"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setFieldValue("avatar", file);

                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setImagePreview(imageUrl);
                          } else {
                            setImagePreview(adminProfile); // Set default image (adminProfile) when no file is selected
                          }
                        }}
                      />
                      <ErrorMessage
                        name="avatar"
                        component="p"
                        className="errorclass"
                      />
                    </div>
                  </div>
                  <div className="flex  items-center justify-between gap-2 flex-col md:flex-row ">
                    <div className="mb-5 ">
                      <div>
                        <label className="me-3 ms-2 text-white">
                          <Field
                            type="radio"
                            name="gender"
                            value="Male"
                            className="text-[#495057] border-[#D9DBDA]-500 border-2 me-1 "
                            checked={values.gender === "Male"}
                            onChange={(e) =>
                              setFormValue({
                                ...formValue,
                                gender: e.target.defaultValue,
                              })
                            }
                          />
                          Male
                        </label>
                        <label className="ms-2 text-white">
                          <Field
                            type="radio"
                            name="gender"
                            value="Female"
                            className="text-[#495057] border-[#D9DBDA]-500 border-2 me-1"
                            checked={values.gender === "Female"}
                            onChange={(e) =>
                              setFormValue({
                                ...formValue,
                                gender: e.target.defaultValue,
                              })
                            }
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
                    <div className="mb-5 md:w-1/2 w-full ">
                      <Field
                        type="date"
                        id="dob"
                        name="dob"
                        value={
                          values.dob
                            ? values.dob.toISOString().substr(0, 10)
                            : ""
                        }
                        className="inputfiled"
                        onChange={(event) => {
                          const selectedDate = new Date(event.target.value);
                          setFieldValue("dob", selectedDate);
                        }}
                      />
                      <ErrorMessage
                        name="dob"
                        component="p"
                        className="errorclass"
                      />
                    </div>
                  </div>
                  <div className="flex  items-center gap-2 flex-col md:flex-row ">
                    <div className="mb-5 md:w-1/2 w-full">
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
                    <div className="mb-5 md:w-1/2 w-full">
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
                  </div>

                  <div className="text-center">
                    <button type="submit" className="buttonStyle ">
                      Update
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editprofile;
