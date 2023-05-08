import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import { useFormik } from "formik";
import { passwordValidate, registerValidation, usernameValidate } from "../helper/validate";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import convertToBase64 from "../helper/convert";

const Register = () => {
  const [file, setFile] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
    },
  });

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const base64 = await convertToBase64(e.target.files[0]);

      if (base64 && typeof base64 === "string") {
        setFile(base64);
      }
    }
  };
  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='flex justify-center items-center  h-screen'>
        <div
          style={{ width: "45%" }}
          className='
        bg-[#ffffff8c] 
        rounded-2xl 
        shadow-glass 
        backdrop-blur 
        border-[rgba(255,255,255,0.3)]
        border-4 border-gray-50 shrink-0  w-[30%]  py-20 px-7 min-w-max
        
        '
        >
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Happy to join you!
            </span>
          </div>
          <form onSubmit={formik.handleSubmit} className='py-1'>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
                <img
                  className='border-4 border-gray-100 w-[135px] rounded-full shadow-lg  cursor-pointer hover:border-gray-200'
                  src={file || avatar}
                  alt='avatar'
                />
                <input
                  onChange={onUpload}
                  className='hidden'
                  type='file'
                  id='profile'
                  name='profile'
                />
              </label>
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input
                {...formik.getFieldProps("email")}
                className='border-0 px-5 py-4 rounded-xl w-3/4 shadow-md text-lg focus:outline-none'
                type='email'
                placeholder='Email*'
              />
              <input
                {...formik.getFieldProps("username")}
                className='border-0 px-5 py-4 rounded-xl w-3/4 shadow-md text-lg focus:outline-none'
                type='text'
                placeholder='Username*'
              />
              <input
                {...formik.getFieldProps("password")}
                className='border-0 px-5 py-4 rounded-xl w-3/4 shadow-md text-lg focus:outline-none'
                type='password'
                placeholder='Password'
              />
              <button
                className='border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
                type='submit'
              >
                Register
              </button>
            </div>
            <div className='text-center py-4'>
              <span>
                Already Register?
                <Link className='text-red-500' to='/'>
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
