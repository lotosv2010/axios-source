import React, {useEffect, useState} from 'react';
// import request from '../utils/request';
import axios, {AxiosResponse} from '../axios';

interface IUser {
  name: string;
  password: string;
}

const getUser = async () => {
  const data: IUser = {
    name: 'test',
    password: '123456'
  }
  // const res = await request.get('/get', {
  //   params
  // })
  const res: AxiosResponse<IUser> = await axios({
    url: 'http://localhost:8080/post_status?code=4000',
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    data
  })
  console.log(JSON.stringify(res, null, 2));
  const {data: user} = res

  return user;
}

function App() {
  const [user, setUser] = useState<IUser>();
  const getData = async () => {
    const user:IUser  = await getUser();
    console.log(user)
    setUser(user);
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <p>name: {user?.name}</p>
      <p>password: {user?.password}</p>
    </div>
  );
}

export default App;
