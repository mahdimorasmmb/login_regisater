import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import { useFormik } from "formik";
import { usernameValidate } from "../helper/validate";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";


const Username = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername)
 
  

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);
      navigate("/password");
    },
  });

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false} />
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
            <h4 className='text-5xl font-bold'>hi</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>
          <form onSubmit={formik.handleSubmit} className='py-1'>
            <div className='profile flex justify-center py-4'>
              <img
                className='border-4 border-gray-100 w-[135px] rounded-full shadow-lg  cursor-pointer hover:border-gray-200'
                src={avatar}
                alt='avatar'
              />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input
                {...formik.getFieldProps("username")}
                className='border-0 px-5 py-4 rounded-xl w-3/4 shadow-md text-lg focus:outline-none'
                type='text'
                placeholder='Username'
              />
              <button
                className='border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
                type='submit'
              >
                Let,s Go
              </button>
            </div>
            <div className='text-center py-4'>
              <span>
                Not a Member{" "}
                <Link className='text-red-500' to='/register'>
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Username;
