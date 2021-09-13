import React, {useEffect, useState} from 'react';
// import request from '../utils/request';
import axios, {AxiosResponse} from '../axios';

interface IUser {
  name: string;
  password: string;
}

const getUser = async () => {
  const params: IUser = {
    name: 'test',
    password: '123456'
  }
  // const res = await request.get('/get', {
  //   params
  // })
  const res: AxiosResponse<IUser> = await axios({
    url: 'http://localhost:8080/get',
    method: 'GET',
    params
  })
  console.log(JSON.stringify(res, null, 2));
  const {data} = res

  return data;
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
