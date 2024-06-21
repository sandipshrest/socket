"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login: React.FC<LoginProps> = ({}) => {
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
      if (response.status === 200) {
        alert(response.data.msg);
        router.push("/");
      } else {
        alert(response.data.msg);
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
