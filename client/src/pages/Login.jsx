import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    userName: '',
    password: '',
  });
  const { userName, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const handleError = (err) =>
    toast.error(err, {
      position: 'bottom-left',
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: 'bottom-left',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputValue);
    try {
      const { data } = await axios.post(
        'https://collaborative-text-editor-gilt.vercel.app/login',
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      userName: '',
      password: '',
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h2 className="font-semibold text-xl ">Login Account</h2>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="userName"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="userName"
            type="text"
            placeholder="Username"
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleOnChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <span>
          Dont Have an Account? <Link to={'/signup'}>SignUp</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};
export default Login;
