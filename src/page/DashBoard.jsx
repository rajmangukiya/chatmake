import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import axios from 'axios';
import { API } from '../config/API/api.config';
import { authenticated, getHttpOptions } from '../utils/AuthHelpers';
import { generateGradient, sliceText } from '../utils/designHelper'
import { logoutIcon } from '../Component/Icons';
import { deleteCookie } from '../utils/Cookie';

const DashBoard = () => {

  const { id } = queryString.parse(useLocation().search);
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const history = useHistory();
  const defaultAvatar = 'data:image/png;base64,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';

  const getUsers = async () => {
    const res = await axios.post(`${API.endpoint}/user/get-all`, { id }, getHttpOptions());
    // console.log(res.data);
    setUsers(res.data.data);
  }

  const getGroups = async () => {
    const res = await axios.get(`${API.endpoint}/room/get-groups`, getHttpOptions());
    setGroups(res.data.groups);
  }

  const logout = () => {
    localStorage.removeItem('token');
    history.push('/')
  }

  const toPersonalChat = async (id2) => {
    const { data: { data } } = await axios.post(`${API.endpoint}/room/one-to-one`, {
      id1: id,
      id2: id2
    }, getHttpOptions());
    history.push(`/chat?id=${id}&room=${data}&prs=1`)
  }

  const toGroupChat = async (roomId) => {
    await axios.post(`${API.endpoint}/room/group-chat`, {
      room_id: roomId,
      user_id: id
    }, getHttpOptions());
    history.push(`/chat?id=${id}&room=${roomId}&prs=0`)
  }

  const makeNewGroup = async (e) => {
    e.preventDefault();
    await axios.post(`${API.endpoint}/room/create-group`, { id, groupname: newGroupName }, getHttpOptions());
    setNewGroupName("");
    getGroups();
  }

  const setCurrentUser = async () => {
    const data = await authenticated()
    setUser(data);
  }

  useEffect(() => {
    setCurrentUser();
    getUsers();
    getGroups();
  }, [])

  // useEffect(() => {
  //   console.log(user);
  // }, [user])


  return (
    <div className="w-100 min-vh-100 bg-dark">
      <div className="h-100 pb-5 d-flex flex-column">
        <div className="d-flex p-5 w-100 justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img style={{ height: '50px', width: '50px' }} className="rounded-circle me-4" src={user?.avatar ?? defaultAvatar} alt="" />
            <div className="text-light d-none d-sm-flex fs-3">{user?.first_name} {user?.last_name}</div>
          </div>
          <div onClick={logout} className="" style={{ cursor: 'pointer' }}>
            {logoutIcon(40, 40, 'white')}
          </div>
        </div>
        <div className="h-75 w-100">
          <div className=" w-100">
            <div className=" w-100 px-5 d-flex flex-wrap-reverse justify-content-center">
              <div className="display-6 text-light flex-xl-grow-1 fw-bold">Chatrooms</div>
              <form onSubmit={(e) => makeNewGroup(e)} className="d-flex py-3 px-5" action="">
                <input className="group-name-input rounded-start bg-heavy-dark text-light flex-grow-1 px-2 py-2" type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                <input className="group-name-btn bg-light-dark opacity-50 text-light rounded-end fw-bold" type="submit" value="new group" />
              </form>
            </div>
            {
              groups.length
              ?
              <div className="room-box d-flex w-100 flex-wrap" style={{ overflowY: 'hidden', minHeight: '200px' }}>
              {
                groups?.map((group, index) => (<div onClick={() => toGroupChat(group.id)} className="m-3">
                  <div className="chat-group-box mt-2 rounded-2" style={{
                    background: `${group?.image ?? generateGradient()}`,
                    cursor: 'pointer',
                    height: '14rem',
                    width: '11rem',
                    flexShrink: 0,
                  }} alt="group_image" ></div>
                  <div className="text-light text-center fs-4">{sliceText(group.name, 10)}</div> F
                </div>))
              }
            </div>
            :
            <div style={{backgroundColor: 'rgb(62, 62, 62)', height: '200px'}} className='w-100 my-5 d-flex justify-content-center align-items-center display-4 text-white'>
              No Groups Available
            </div>
            }
          </div>
          <div className="d-flex justify-content-center">
            {
              users.length 
              ?
              <div className="chat-outer-box p-2" >
              {
                users?.map((user, i) => (
                  <div key={i} onClick={() => toPersonalChat(user.id)} className="chat-one-box text-light d-flex align-items-center p-3 rounded-3" style={{ cursor: 'pointer' }}>
                    <img className="rounded-circle me-3" style={{ width: '3rem' }} src={user?.avatar ?? defaultAvatar} alt="" />
                    <div className="flex-grow-1">
                      <div className="fs-5">{user.first_name}</div>
                      <div className="opacity-50">{user?.message ?? 'no conversation'}</div>
                    </div>
                    <div className="opacity-50">{user?.lastDate ?? 'new mate'}</div>
                  </div>
                ))
              }
            </div>
            :
              <div style={{height: '200px'}} className='chat-outer-box text-white d-flex justify-content-center align-items-center display-5'>
                No users available
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
