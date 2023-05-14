import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_SRVER_DOMAIN;


export async function getUsername() {
  const token = localStorage.getItem('token')
  if(!token) return Promise.reject('Cannot find token')
  const decode = jwtDecode(token)
 
  
  return decode
  
}

export async function authenticate(username: string) {
  try {
    const { data, status } = await axios.post("/api/authenticate", {
      username,
    });
    return {
      data,
      status,
    };
  } catch (error) {
    return {
      error: "User name doesn,t exist...!",
    };
  }
}

export async function getUser({ username }: { username: string }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return data;
  } catch (error) {
    return {
      error: "Password dosn,t Match...!",
    };
  }
}

export async function registerUser(credentials: {
  username: string;
  email: string;
}) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credentials);

    const { username, email } = credentials;

    if (status === 201) {
      await axios.post(`/api/registerMail`, {
        username,
        userEmail: email,
        text: msg,
      });
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyPassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    if (username) {
      const { data } = await axios.post(`/api/login`, { username, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn,t Match..." });
  }
}

export async function updateUser(response: any) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(`/api/updateuser`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn,t Update Profile...!" });
  }
}

export async function generateOTP(username: string) {
  try {
    console.log(username);
    
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: { username } });

    if (status === 201) {
      const {
        data: { email },
      } = await getUser({ username });
      const text = `Your Password Recovery OTP is ${code}. Verify and recovery yor password `;

      await axios.post(`/api/registerMail`, {
        username,
        userEmail: email,
        text,
        subject: "Password Recover",
      });
    }
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyOTP({
  username,
  code,
}: {
  username: string;
  code: number;
}) {
  try {
    const { data, status } = await axios.get(`/api/verifyOTP`, {
      params: { username, code },
    });

    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function resetPassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const { data, status } = await axios.put(`/api/resetPassword`, {
      username,
      password,
    });

    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
