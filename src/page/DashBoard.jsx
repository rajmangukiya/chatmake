import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import axios from 'axios';
import { API } from '../config/API/api.config';
import { Authenticated, getHttpOptions } from '../utils/AuthHelpers';
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

  const getUsers = async () => {
    const res = await axios.post(`${API.endpoint}/user/get-all`, { id }, getHttpOptions());
    setUsers(res.data.data);
  }

  const getGroups = async () => {
    const res = await axios.get(`${API.endpoint}/room/get-groups`, getHttpOptions());
    setGroups(res.data.groups);
  }

  const toHome = () => {
    deleteCookie('auth')
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
    const { data: { data } } = await Authenticated()
    setUser(data);
  }

  useEffect(() => {
    setCurrentUser();
    getUsers();
    getGroups();
  }, [])

  return (
    <div className="w-100 min-vh-100 bg-dark">
      <div className="h-100 pb-5 d-flex flex-column">
        <div className="d-flex p-5 w-100 justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img className="rounded-circle me-4" src={user?.avatar} style={{ width: '4rem' }} alt="" />
            <div className="text-light d-none d-sm-flex fs-3">{user?.first_name} {user?.last_name}</div>
          </div>
          <div onClick={toHome} className="" style={{cursor: 'pointer'}}>
          {logoutIcon(40, 40, 'white')}
          </div>
        </div>
        <div className="h-75 w-100">
          <div className=" w-100">
            <div className=" w-100 px-5 d-flex flex-wrap-reverse justify-content-center">
              <div className="display-6 text-light flex-xl-grow-1">Chatrooms</div>
              <form onSubmit={(e) => makeNewGroup(e)} className="d-flex py-3 px-5" action="">
                <input className="group-name-input rounded-start bg-heavy-dark text-light flex-grow-1 px-2 py-2" type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                <input className="group-name-btn bg-light-dark opacity-50 text-light rounded-end fw-bold" type="submit" value="new group" />
              </form>
            </div>
            <div className="room-box d-flex" style={{ overflowY: 'hidden' }}>
              {
                groups?.map((group, index) => (<div onClick={() => toGroupChat(group.id)} className="m-3">
                  <div className="text-light text-center opacity-50">{sliceText(group.name, 10)}</div>
                  <div className="chat-group-box mt-2" style={{
                    background: `${group?.image ?? generateGradient()}`,
                    cursor: 'pointer',
                    height: '14rem',
                    width: '11rem',
                    flexShrink: 0,
                    borderRadius: '60px'
                  }} alt="group_image" />
                </div>))
              }
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="chat-outer-box p-2 pt-3" >
              {
                users?.map((user) => (
                  <div onClick={() => toPersonalChat(user.id)} className="chat-one-box text-light d-flex align-items-center p-3 rounded-3" style={{ cursor: 'pointer' }}>
                    <img className="rounded-circle me-3" style={{ width: '3rem' }} src={user?.avatar} alt="" />
                    <div className="flex-grow-1">
                      <div className="fs-5">{user.first_name}</div>
                      <div className="opacity-50">{user?.message ?? 'no conversation'}</div>
                    </div>
                    <div className="opacity-50">{user?.lastDate ?? 'new mate'}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
