import axios from 'axios'
const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const SignIn = async (data) => {
    const res = await axios.post(
      `${BaseUrl}/user/signin`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res;
}

export const signOut = async () => {
 localStorage.removeItem('token');
}