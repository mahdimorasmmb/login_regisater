import { toast } from "react-hot-toast";
import { authenticate } from "./helper";

type ErrorInput = {
  password?: string;
  exist?: string;
  username?: string;
  email?: string;
};

export const usernameValidate = async (values: { username: string }) => {
  const error = usernameVerify(values, {});


  if(values.username) {
    const {status} = await authenticate(values.username) 

    if(status !==200) {
      error.exist = toast.error('User Does not exist ')
    }
  }
  return error;
};

export const passwordValidate = async (values: { password: string }) => {
  const error = passwordVerify(values, {});
  console.log(values);

  if (error.password) {
    return error;
  }
};

export const restPassordValidate = async (values: {
  password: string;
  confirm_pwd: string;
}) => {
  const error = passwordVerify(values, {});

  if (values.password !== values.confirm_pwd) {
    error.exist = toast.error("Password not match...!");
  }

  if (error.password || error.exist) {
    return error;
  }
};

export const registerValidation = async (values: {
  email: string;
  username: string;
  password: string;
}) => {
  const error = usernameVerify(values, {});

  passwordVerify(values, error);
  emailVerfy(values, error);

  return error;
};

export const profileValidation = async (values: { email: string }) => {
  const error = emailVerfy(values, {});
  return (await error).email;
};

const passwordVerify = (values: { password: string }, error: ErrorInput) => {
  const specialChars = /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
  if (!values.password) {
    error.password = toast.error("Password Required ....!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Invalid Password...!");
  } else if (values.password.length < 4) {
    error.password = toast.error(" Password must more than 4 characters login");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special Charecters");
  }

  return error;
};

const usernameVerify = (values: { username: string }, error: ErrorInput) => {
  if (!values.username) {
    error.username = toast.error("Username Required ....!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username...!");
  }

  return error;
};

const emailVerfy = async (values: { email: string }, error: ErrorInput) => {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
};
