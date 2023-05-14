

import { useFormik } from "formik";
import {  restPassordValidate } from "../helper/validate";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { resetPassword } from "../helper/helper";
import { useNavigate } from "react-router-dom";

const Reset = () => {
 const navigate =  useNavigate()
  const {username} = useAuthStore(state => state.auth)
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd:''
    },
    validate:restPassordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const restPromise = resetPassword({username,password:values.password})

      toast.promise(restPromise,{
        loading:"Updating...!",
        success:<b>Reset Successfully...!</b>,
        error:<b>Could not Reset</b>
      })

      restPromise.then(()=>{navigate('/password')})
    },
  });
  return (
    <div className='container mx-auto'>
      <Toaster position="top-center" reverseOrder={false}/>
      <div className='flex justify-center items-center  h-screen'>
        <div
          className='
        bg-[#ffffff8c] 
        rounded-2xl 
        shadow-glass 
        backdrop-blur 
        border-[rgba(255,255,255,0.3)]
        border-4 border-gray-50 shrink-0 h-3/4 w-[30%]  py-20 px-7 min-w-max
        
        '
        >
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Rest</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
             Enter new Password
            </span>
          </div>
          <form onSubmit={formik.handleSubmit} className='py-20'>
          
            <div className='textbox flex flex-col items-center gap-6'>
              <input
                {...formik.getFieldProps("password")}
                className='border-0 px-5 py-4 rounded-xl w-3/4 shadow-md text-lg focus:outline-none'
                type='password'
                placeholder='New Password'
              />
               <input
                {...formik.getFieldProps("confirm_pwd")}
                className='border-0 px-5 py-4 rounded-xl w-3/4 shadow-md text-lg focus:outline-none'
                type='password'
                placeholder='Repeat Password'
              />
              <button
                className='border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
                type='submit'
              >
               Reset
              </button>
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
