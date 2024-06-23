"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { loginUser } from "@/redux/reducerSlice/userSlice";

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
    <div>
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
          <Form>
            <Field name="email" type="email" />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
            <Field name="password" type="password" />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;

interface LoginProps {}
