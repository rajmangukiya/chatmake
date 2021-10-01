import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import axios from 'axios';

const DashBoard = () => {

  const { username } = queryString.parse(useLocation().search);
  const [users, setUsers] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const history = useHistory();

  const getUsers = async () => {
    const res = await axios.post('http://localhost:5000/api/v1/user/get-all', { username });
    setUsers(res.data.data);
  }

  const getGroups = async () => {
    const res = await axios.get('http://localhost:5000/api/v1/room/get-groups');
    setGroups(res.data.groups);
  }

  const toHome = () => {
    history.push('/')
  }

  const toPersonalChat = async (username2) => {
    const { data: { data } } = await axios.post('http://localhost:5000/api/v1/room/one-to-one', {
      username1: username,
      username2: username2
    });
    history.push(`/chat?username=${username}&room=${data}`)
  }

  const toGroupChat = async (roomId) => {
    history.push(`/chat?username=${username}&room=${roomId}`)
  }

  const makeNewGroup = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/v1/room/create-group", {username, groupname: newGroupName});
    getGroups();
  }

  useEffect(() => {
    getUsers();
    getGroups();
  }, [])

  return (
    <div className="w-100 vh-100">
      <div className="container h-100 pb-5 d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex my-5 w-100 justify-content-between">
          <div onClick={toHome} className="btn btn-primary fs-5 px-4 text-light">
            back
          </div>
          <div className="text-primary fs-5 text-center">
            Welcome, {username}
          </div>
        </div>
        <div className="w-100 h-75 d-flex">
          <div className="w-50 p-3 flex-grow-1 d-flex flex-column">
            <div className="w-100 rounded-3 bg-primary text-center py-2 text-light fw-bold">Users</div>
            <div className="p-2 pt-3 d-flex flex-wrap">
              {
                users?.map((user) => (<div onClick={() => toPersonalChat(user.username)} className="border border-primary px-4 py-1 m-2 rounded-pill text-primary" style={{ cursor: 'pointer' }}>{user.username}</div>
                ))
              }
            </div>
          </div>
          <div className="w-50 p-3 flex-grow-1 d-flex flex-column">
            <div className="w-100 rounded-3 bg-primary text-center py-2 text-light fw-bold">Groups</div>
            <form onSubmit={(e) => makeNewGroup(e)} className="d-flex py-3 px-5" action="">
              <input className="rounded-start border border-primary flex-grow-1 px-2 py-1" type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
              <input className="bg-primary text-light rounded-end px-5" type="submit" />
            </form>
            <div className="p-2 pt-3 d-flex flex-wrap">
              {
                groups?.map((group) => (<div onClick={() => toGroupChat(group.id)} className="border border-primary px-4 py-1 m-2 rounded-pill text-primary" style={{ cursor: 'pointer' }}>{group.name}</div>
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
