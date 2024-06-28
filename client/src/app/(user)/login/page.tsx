"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { loginUser } from "@/redux/reducerSlice/userSlice";
import Link from "next/link";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login: React.FC<LoginProps> = ({}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (values: any) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        data
      );
      if (response.status === 201) {
        toast.success(response.data.msg);
        router.push("/");
        dispatch(
          loginUser({
            toker: response.data.token,
            userDetail: response.data.userDetail,
          })
        );
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
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          handleLogin(values);
        }}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col w-1/4 mx-auto p-8 shadow-lg bg-gray-50 rounded-md gap-8">
            <h2 className="text-3xl font-semibold">Sign In</h2>
            <div className="w-full flex flex-col gap-5">
              <Field
                name="email"
                type="email"
                placeholder="Enter email"
                className="border-b border-gray-600 focus:outline-none placeholder:text-black p-1"
              />
              {errors.email && touched.email ? (
                <div className="text-sm text-red-700">{errors.email}</div>
              ) : null}
              <Field
                name="password"
                type="password"
                placeholder="Enter password"
                className="border-b border-gray-600 focus:outline-none placeholder:text-black p-1"
              />
              {errors.password && touched.password ? (
                <div className="text-sm text-red-700">{errors.password}</div>
              ) : null}
              <button
                type="submit"
                className="bg-blue-700 py-2 rounded-md text-white"
              >
                Submit
              </button>
              <p>Don't have an account? <Link href="/register" className="underline font-medium">Create new</Link></p>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default Login;

interface LoginProps {}
