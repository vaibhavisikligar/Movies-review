import { createSlice } from "@reduxjs/toolkit";
// export const signup = async ({ formData, navigate }) => {
//   try {
//     const response = await fetch("http://localhost:8080/api/signUp", {
//       method: "POST",
//       body: formData,
//     });
//     if (!response.ok) {
//       throw new Error("signup failed");
//     }
//     const data = await response.json();
//     if (data.status === 200) navigate("/login");
//   } catch (error) {
//     alert(error.response.data.error.message);
//   }
// };
export const signup = async ({ formData, navigate }) => {
  try {
    const response = await fetch("http://localhost:8080/api/signUp", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("signup failed");
    }

    const data = await response.json();
    if (data.status === "success") {
      navigate("/login");
    } else {
      throw new Error(data.error); // Handle specific error cases
    }
    return data.data;
  } catch (error) {
    // Handle different types of errors here
    if (error instanceof TypeError) {
      alert("Network error occurred. Please try again.");
    } else {
      alert(`Error: ${error.message}`);
    }
  }
};

const signupSlice = createSlice({
  name: "signup",
  initialState: {},
  reducers: {},
});
export default signupSlice.reducer;
