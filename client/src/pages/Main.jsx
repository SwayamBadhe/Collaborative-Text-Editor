import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Main = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  useEffect(() => {
    console.log(cookies.token);

    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate('/login');
      }
      const { data } = await axios.post(
        'http://localhost:3001',
        {},
        { withCredentials: true }
      );

      const { status, user } = data;

      return status
        ? toast(`Hello ${user}`, {
            position: 'top-right',
          })
        : (removeCookie('token'), navigate('/login'));
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const performLogout = () => {
    removeCookie('token');
    navigate('/signup');
  };

  return (
    <>
      <div className="text-center">
        <h4 className="text-lg font-bold mb-2">
          Welcome <span className="text-blue-500"></span>
        </h4>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={performLogout}
        >
          LOGOUT
        </button>
      </div>
    </>
  );
};
export default Main;
