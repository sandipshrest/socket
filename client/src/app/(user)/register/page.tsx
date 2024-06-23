"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Required")
    .matches(/[A-Z]/, "Must Contain One Uppercase character"),
  rePassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords does not match"),
});

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();

  const handleRegister = async (values: any) => {
    try {
      const data = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
        data
      );
      if (response.status === 201) {
        toast.success(response.data.msg);
        router.push("/login");
      } else {
        toast.error(response.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="h-screen w-full flex justify-center items-center">
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          rePassword: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          handleRegister(values);
        }}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col w-1/4 mx-auto p-8 shadow-lg bg-gray-50 rounded-md gap-8">
            <h2 className="text-3xl font-semibold">Sign Up</h2>
            <div className="w-full flex flex-col gap-5">
              <Field
                name="fullName"
                placeholder="Enter your full name"
                className="border-b border-gray-600 focus:outline-none placeholder:text-black p-1"
              />
              {errors.fullName && touched.fullName ? (
                <div className="text-red-600 text-sm">{errors.fullName}</div>
              ) : null}
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className="border-b border-gray-600 focus:outline-none placeholder:text-black p-1"
              />
              {errors.email && touched.email ? (
                <div className="text-red-600 text-sm">{errors.email}</div>
              ) : null}
              <Field
                name="password"
                type="password"
                placeholder="Create password"
                className="border-b border-gray-600 focus:outline-none placeholder:text-black p-1"
              />
              {errors.password && touched.password ? (
                <div className="text-red-600 text-sm">{errors.password}</div>
              ) : null}
              <Field
                name="rePassword"
                type="password"
                placeholder="Confirm password"
                className="border-b border-gray-600 focus:outline-none placeholder:text-black p-1"
              />
              {errors.rePassword && touched.rePassword ? (
                <div className="text-red-600 text-sm">{errors.rePassword}</div>
              ) : null}
              <button type="submit" className="bg-blue-700 py-2 rounded-md text-white">Register</button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default Register;

interface RegisterProps {}
