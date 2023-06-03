import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { googleIcon } from '../Component/Icons';
import { API } from '../config/API/api.config';
import { authenticated } from '../utils/AuthHelpers';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { BsGithub, BsApple } from "react-icons/bs";

const Home = () => {

  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { token } = queryString.parse(window.location.search);

  const toGoogleLogin = async () => {
    const { data: { url } } = await axios.get(`${API.endpoint}/auth/google`);
    window.location.href = url;
  }

  useEffect(async () => {
    if(token) {
      localStorage.setItem('token', token);
    }
    const { id } = await authenticated();
    if(id) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <div className="w-100 h-100 d-flex">
      <div className='w-50 h-100 d-flex justify-content-center align-items-center'>
        <img className='h-75' src={'https://img.freepik.com/free-vector/conversation-concept-illustration_114360-1305.jpg?size=626&ext=jpg&ga=GA1.1.900366228.1682620286&semt=sph'} />
      </div>
      <div className='w-50 d-flex justify-content-center align-items-center'>
        <div className="w-50 border border-1 d-flex flex-column align-items-center py-5" style={{ height: '60vh', borderRadius: '10px' }}>
          <h1 className='text-primary mb-4'>CHATMAKE</h1>
          <h6>Log in to continue</h6>
          {/* <div className='border-bottom border-1 w-75 mt-3 mb-5'></div> */}
          <div className='w-75 mt-5'>
            <div onClick={toGoogleLogin} className="chat-list-item btn border border-1 py-2 d-flex justify-content-center align-items-center">
              <FcGoogle className='fs-2' />
              <div className="ms-2 fs-5">Google</div>
            </div>
            <div style={{cursor: 'no-drop'}} className="border border-1 py-2 d-flex justify-content-center align-items-center mt-3 opacity-50">
              <BsGithub className='fs-2' />
              <div className="ms-2 fs-5">Github</div>
            </div>
            <div style={{cursor: 'no-drop'}} className="border border-1 py-2 d-flex justify-content-center align-items-center mt-3 opacity-50">
              <BsApple className='fs-2' />
              <div className="ms-2 fs-5">Apple</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
