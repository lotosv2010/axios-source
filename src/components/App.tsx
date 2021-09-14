import React, {useEffect, useState} from 'react';
// import request from '../utils/request';
import axios, {AxiosResponse} from '../axios';

interface IUser {
  name: string;
  password: string;
}

const CancelToken = axios.CancelToken;
const isCancel = axios.isCancel;
const source = CancelToken.source();

const getUser = async () => {
  const data: IUser = {
    name: 'test',
    password: '123456'
  }
  // const res = await request.get('/get', {
  //   params
  // })

  try {
    source.cancel('用户取消了请求');
    const res: AxiosResponse<IUser> = await axios({
      url: 'http://localhost:8080/post',
      method: 'POST',
      headers: {
        // 'content-type': 'application/json',
        'name': 'test'
      },
      data,
      cancelToken: source.token
    })
    
    console.log(JSON.stringify(res, null, 2));
    const user = res
    return user;
  } catch (error) {
    if(isCancel(error)) {
      console.log('isCancel取消请求：', error);
    } else {
      console.error(error);
    }
  }
}

function App() {
  const [user, setUser] = useState<IUser>();
  const getData = async () => {
    const user: any = await getUser();
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
