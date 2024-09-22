import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createMovies, updateMovies } from "../redux/moviesSlice";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
const initialValues = {
  moviename: "",
  description: "",
  poster: "",
  genre: [],
  director: "",
  year: "",
  rating: "",
};
const genreOptions = [
  { label: "Action", value: "Action" },
  { label: "Drama", value: "Drama" },
  { label: "Horror", value: "Horror" },
  { label: "Thriller", value: "Thriller" },
  { label: "Romance", value: "Romance" },
  { label: "Comedy", value: "Comedy" },
  { label: "Documentary", value: "Documentary" },
  { label: "Animation", value: "Animation" },
  { label: "Fiction", value: "Fiction" },
  { label: "Crime", value: "Crime" },
  { label: "Mystery", value: "Mystery" },
  { label: "War", value: "War" },
  { label: "Adventure", value: "Adventure" },
  { label: "Fantasy", value: "Fantasy" },
  { label: "Science Fiction", value: "Science Fiction" },
  { label: "Musical", value: "Musical" },
];
const handleValidate = Yup.object().shape({
  moviename: Yup.string().required("Movie name is required!"),
  description: Yup.string().required("Description is required!"),
  poster: Yup.string().required("Poster is required"), // Assuming posterBase64 is mandatory
  genre: Yup.array()
    .min(1, "At least one genre must be selected")
    .required("Genre is required"),
  director: Yup.string().required("Director is required!"),
  year: Yup.number().required("Year is required!"),
  rating: Yup.number().required("Rating is required!"),
});
const AddMovies = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [movieValue, setMovieValue] = useState(initialValues);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const { state } = useLocation();
  const fileInputRef = useRef(null); // Create a ref for the file input element
  const handleGenreChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedGenres(selectedValues);
  };

  useEffect(() => {
    if (state) {
      setMovieValue(state);
      setSelectedGenres(state.genre || []); // Set selected genres if available in state
    } else {
      setMovieValue(initialValues);
      setSelectedGenres([]); // Reset selected genres if no state is available
    }
  }, [state]);
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("moviename", values.moviename);
    formData.append("description", values.description);
    formData.append("director", values.director);
    formData.append("year", values.year);
    formData.append("rating", values.rating);
    formData.append("poster", values.poster);
    selectedGenres.forEach((genreItem) => {
      formData.append("genre[]", genreItem); // Use selectedGenres state here
    });
    if (state) {
      setMovieValue(initialValues);
      toast.success("Movie updated successfully");
      dispatch(updateMovies({ id: state._id, formData }));
    } else {
      setMovieValue(initialValues);
      toast.success("Movie created successfully");
      dispatch(createMovies(formData));
    }
  };

  return (
    <div className="container py-14">
      <div className="w-full  ">
        <Toaster />
        <h2 className="mb-3 text-center ">
          {state ? "Edit Movies " : "Add new movie"}
        </h2>

        <div className="flex justify-center items-center">
          <div className="w-full md:w-1/2 lg:w-2/4 xl:w-1/4">
            <Formik
              initialValues={movieValue}
              validationSchema={handleValidate}
              onSubmit={handleSubmit}
              enableReinitialize="true"
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="mb-5 ">
                    <Field
                      type="text"
                      id="moviename"
                      name="moviename"
                      placeholder="Movie Name"
                      className="inputfiled"
                      value={values.moviename}
                    />
                    <ErrorMessage
                      name="moviename"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-5 ">
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      placeholder="Description"
                      className="inputfiled"
                      value={values.description}
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="errorclass"
                    />
                  </div>

                  <div className="mb-5 ">
                    <Field
                      type="text"
                      name="director"
                      className="inputfiled"
                      placeholder="Director"
                      value={values.director}
                    />
                    <ErrorMessage
                      name="director"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-5 ">
                    <Field
                      type="number"
                      id="year"
                      name="year"
                      placeholder="Year"
                      className="inputfiled"
                      value={values.year}
                    />
                    <ErrorMessage
                      name="year"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-5 ">
                    <Field
                      type="number"
                      id="rating"
                      name="rating"
                      placeholder="Rating"
                      className="inputfiled"
                      value={values.rating}
                    />
                    <ErrorMessage
                      name="rating"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="poster"
                      className="inputfiled"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("poster", file);
                      }}
                    />
                    <ErrorMessage
                      name="poster"
                      component="p"
                      className="errorclass"
                    />
                  </div>

                  <div className="mb-3">
                    <Select
                      value={genreOptions.filter((option) =>
                        selectedGenres.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        handleGenreChange(selectedOptions);
                        setFieldValue(
                          "genre",
                          selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : []
                        );
                      }}
                      options={genreOptions}
                      isMulti={true}
                      name="genre"
                    />
                    <ErrorMessage
                      name="genre"
                      component="p"
                      className="errorclass"
                    />
                  </div>
                  <div className="text-center mt-6">
                    {state ? (
                      <button type="submit" className="buttonStyle ">
                        Update movie
                      </button>
                    ) : (
                      <button type="submit" className="buttonStyle ">
                        Add movie
                      </button>
                    )}
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

export default AddMovies;
