import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { API } from '../config/API/api.config';

const Home = () => {

  const [username, setUsername] = useState("");
  const history = useHistory();

  const toDashboard = async () => {
    await axios.post(`${API.endpoint}/user/auth/signup`, { username });
    history.push(`/dashboard?username=${username}`);
  }

  return (
    <div>
      <div className="home-box container py-5">
        <h1 className="text-center text-primary mb-5">Chat Make</h1>
        <div className="bg-primary d-flex flex-column p-5 rounded-3 justify-content-center align-items-center" style={{height: '60vh'}}>
          <input className="w-75 rounded-3 px-3 py-2" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="username" type="text"/>
          <div onClick={toDashboard} className="btn btn-light mt-3 text-primary px-4">Enter</div>
        </div>
      </div>
    </div>
  )
}

export default Home
