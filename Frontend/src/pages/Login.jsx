import React , {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EHeader from '../components/EHeader';


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const api ='http://localhost:3000';


    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post(`${api}/login`, { email, password })
            .then(response => {
                localStorage.setItem('token',response.data.token)
                console.log(response);
                if(response.data.user.email.endsWith('.admin@lifecare.com')){
                    navigate('/inventory');
                }
                else if(response.data.user.email.endsWith('.doc@gmail.com')){
                    navigate('/doc-view');
                }
                else{
                    navigate('/home');
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error) {
                    setErrorMessage(error.response.data.error); 
                } else {
                    setErrorMessage('Something went wrong. Please try again.');
                }
                navigate('/login');
            });
    }



  return (
    <>
    <EHeader />
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
          onClick={handleSubmit}
        >
          Log in
        </button>
        <div className="text-center mb-4">or</div>
        <button className="w-full bg-gray-100 text-gray-700 p-2 rounded flex items-center justify-center mb-4">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Login with Google
        </button>
        <p className="text-center text-blue-500 text-sm">
          Don’t have an account? <a href="/register" className="underline">Sign up</a>
        </p>
      </form>
    </div>
    </>
  );
}

export default Login;