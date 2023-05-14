import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { useEffect, useState } from "react";
import { generateOTP } from "../helper/helper";
import { verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";

const Recovery = () => {
  const navigate = useNavigate();

  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState("");

  useEffect(() => {
    generateOTP(username).then((OTP) => {

      if (OTP) return toast.success("otp HAS BEEN SEND TO YOUR EMAIL");
      return toast.error("Problem while geneating OTP");
    });
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();

   try {
    const { status } = await verifyOTP({ username, code: Number(OTP) });

    if (status === 201) {
      toast.success("Verify Successfully");
      return navigate("/reset");
    }

    
   } catch (error) {
    return toast.error("Wront OTP! Check eamil");
   }
  }

  function resendOTP() {
    const sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "Sending",
      success: <b>OTP has been send to your email</b>,
      error: <b>Could not Send it !</b>,
    });

    sendPromise.then((OTP) => {
      console.log(OTP);
    });
  }

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
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recovery password
            </span>
          </div>
          <form onSubmit={onSubmit} className='pt-20'>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className='input text-center'>
                <span className='PY-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  className='border-0 px-5 py-4 rounded-xl w-3/4 shadow-md text-lg focus:outline-none'
                  type='text'
                  placeholder='OTP'
                />
              </div>
              <button
                className='border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
                type='submit'
              >
                Sign in
              </button>
            </div>
            <div className='text-center py-4'>
              <span>
                Can't get OTP
                <button onClick={resendOTP} className='text-red-500'>
                  Resend
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
