import { Route, Routes } from 'react-router-dom';
import { Home, Login, Signup } from './pages';
import Main from './pages/Main';

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
}

export default App;
