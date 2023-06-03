import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API } from '../config/API/api.config';
import { authenticated, getHttpOptions } from '../utils/AuthHelpers';
import { useNavigate } from 'react-router-dom';
import ChatList from '../Component/ChatList';
import ChatBox from '../Component/ChatBox';

const DashBoard = () => {

  const [user, setUser] = useState();
  const [chatUser, setChatUser] = useState();
  const [users, setUsers] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate()

  const getUsers = async () => {
    try {
      const res = await axios.post(`${API.endpoint}/user/get-all`, { id: user?.id }, getHttpOptions());
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getGroups = async () => {
    try {
      const res = await axios.get(`${API.endpoint}/room/get-groups`, getHttpOptions());
      setGroups(res.data.groups);
    } catch (error) {
      console.log(error);
    }
  }

  const toPersonalChat = async (id2) => {
    try {
      const { data: { data } } = await axios.post(`${API.endpoint}/room/one-to-one`, {
        id1: user?.id,
        id2: id2
      }, getHttpOptions());
      navigate('/chat',{
        state: {
          id: user?.id,
          roomId: data,
          prs: 1
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const toGroupChat = async (roomId) => {
    try {
      await axios.post(`${API.endpoint}/room/group-chat`, {
        room_id: roomId,
        user_id: user?.id
      }, getHttpOptions());
      navigate('/chat',{
        state: {
          id: user?.id,
          roomId: roomId,
          prs: 0
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const makeNewGroup = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${API.endpoint}/room/create-group`, { id: user?.id , groupname: newGroupName }, getHttpOptions());
      setNewGroupName("");
      getGroups();
    } catch (error) {
      console.log(error);
    }
  }

  const setCurrentUser = async () => {
    try {
      const data = await authenticated()
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setCurrentUser();
  }, [])

  useEffect(() => {
    user && getUsers();
    user && getGroups();
  }, [user])


  return (
    <div className="d-flex vh-100">
      <ChatList user={user} dataList={users} chatUser={chatUser} setChatUser={setChatUser} />
      <ChatBox chatUser={chatUser} />
    </div>
  )
}

export default DashBoard
