import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import { useFormik } from "formik";
import { passwordValidate, usernameValidate } from "../helper/validate";
import { Toaster, toast } from "react-hot-toast";
import { verifyPassword } from "../helper/helper";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/fetch.hook";

const Password = () => {
  const navigate = useNavigate()
  const {username} = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate:passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const loginPromise = verifyPassword({username,password:values.password})

      toast.promise(loginPromise,{
        loading:'Checking...!',
        success:<b>Login Successfully ..!</b>,
        error:<b>Password Not Match</b>
      })

      loginPromise.then(res => {
       if(res){
        const {token} = res.data
        localStorage.setItem('token',token)
        navigate('/profile')
       }
      })
    },
  });

  
  if (isLoading) return <h1 className='text-2xl font-bold'> isLoading</h1>;
  if (serverError)
    return <h1 className='text-xl text-red-500'> {serverError.message}</h1>;
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
            <h4 className='text-5xl font-bold'>hi {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>
          <form onSubmit={formik.handleSubmit} className='py-1'>
            <div className='profile flex justify-center py-4'>
              <img
                className='border-4 border-gray-100 w-[135px] rounded-full shadow-lg  cursor-pointer hover:border-gray-200'
                src={ apiData?.profile || avatar}
                alt='avatar'
              />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
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
               Sign in 
              </button>
            </div>
            <div className='text-center py-4'>
              <span>
               Forgot Passord{" "}
                <Link className='text-red-500' to='/recovery'>
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;
