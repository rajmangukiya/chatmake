import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { googleIcon } from '../Component/Icons';
import { API } from '../config/API/api.config';
import { Authenticated } from '../utils/AuthHelpers';

const Home = () => {

  const [username, setUsername] = useState("");
  const history = useHistory();

  const toDashboard = async () => {
    await axios.post(`${API.endpoint}/user/auth/signup`, { username });
    history.push(`/dashboard?username=${username}`);
  }

  const toGoogleLogin = async () => {
    const { data: { url } } = await axios.get(`${API.endpoint}/auth/google`);
    window.location.href = url;
  }

  useEffect(async () => {
    const { data: { data: { id } } } = await Authenticated();
    console.log(id);
    id && history.push(`/dashboard?id=${id}`) 
  }, [])

  return (
    <div className="w-100 vh-100 bg-heavy-dark">
      <div className="home-box container py-5">
        <h1 className="text-center text-light mb-5">Chat Make</h1>
        <div className="bg-light-dark d-flex flex-column p-5 rounded-3 justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div onClick={toGoogleLogin} className="btn btn-dark mt-3 text-light py-3 px-4 d-flex align-items-center">
            {googleIcon(40, 40, 'white')}
            <div className="ms-2 fs-5">Google Login</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home
