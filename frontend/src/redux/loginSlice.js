import { createSlice } from "@reduxjs/toolkit";
export const login =
  ({ values, navigate }) =>
  async (dispatch) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      // Verify the response structure and data availability
      if (!data || !data.token || !data.data) {
        throw new Error("Invalid response format or missing data");
      }

      const token = data.token;
      localStorage.setItem("token", token);
      navigate("/");
      return data.data;
    } catch (error) {
      alert(error.message);
    }
  };

export const updateUser =
  ({ id, formData }) =>
  async (dispatch) => {
    console.log(id, formData);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "PATCH",
        headers: {
          authorization: token,
        },
        body: formData, // Pass formData directly without JSON.stringify
      });
      const data = await response.json();
      dispatch(setUser(data.data));
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };
export const forgotPassword =
  ({ email, navigate }) =>
  async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.status === "success") navigate("/login");
      alert(data.message);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  };

export const resetPassword =
  ({ password, confirmpassword, _id, token }) =>
  async () => {
    console.log("values", password, confirmpassword);
    try {
      const response = await fetch(
        `http://localhost:8080/api/resetPassword/${_id}/${token}`,
        {
          method: "POST",
          body: JSON.stringify({ password, confirmpassword }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      console.log("Data:", data);
      alert(data.message);
      return data.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

const loginSlice = createSlice({
  name: "login",
  initialState: {
    userlist: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.userlist = action.payload;
    },
  },
});
export const { setUser } = loginSlice.actions;
export default loginSlice.reducer;
