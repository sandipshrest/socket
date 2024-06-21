"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";

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
    const data = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
      data
    );
    if (response.status === 200) {
      alert(response.data.msg);
      router.push("/login");
    } else {
      alert(response.data.msg);
    }
    try {
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
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
          <Form>
            <Field name="fullName" />
            {errors.fullName && touched.fullName ? (
              <div>{errors.fullName}</div>
            ) : null}
            <Field name="email" type="email" />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
            <Field name="password" type="password" />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <Field name="rePassword" type="password" />
            {errors.rePassword && touched.rePassword ? (
              <div>{errors.rePassword}</div>
            ) : null}
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;

interface RegisterProps {}
