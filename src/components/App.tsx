import React, {useEffect, useState} from 'react';
// import request from '../utils/request';
import axios, {AxiosResponse, AxiosRequestConfig} from '../axios';

interface IUser {
  name: string;
  password: string;
}

console.time('cost');
// todo:请求拦截器先加的后执行
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers && (config.headers.name += '1');
  console.timeEnd('cost');
  return config;
}, (error: any) => Promise.reject(error));
const request = axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers && (config.headers.name += '2');
  return config;
});
axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      config.headers && (config.headers.name += '3');
      resolve(config);
    }, 3000)
  })
});
axios.interceptors.request.eject(request); // 弹出
// todo:响应拦截器先加的先执行
axios.interceptors.response.use((response: AxiosResponse) => {
  response.data.name += '1';
  return response;
});
const response = axios.interceptors.response.use((response: AxiosResponse) => {
  response.data.name += '2';
  return response;
});
axios.interceptors.response.use((response: AxiosResponse) => {
  response.data.name += '3';
  return response;
});
axios.interceptors.response.eject(response); // 弹出


const getUser = async () => {
  const data: IUser = {
    name: 'test',
    password: '123456'
  }
  // const res = await request.get('/get', {
  //   params
  // })

  try {
    const res: AxiosResponse<IUser> = await axios({
      url: 'http://localhost:8080/post',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'name': 'test'
      },
      data
    })
    console.log(JSON.stringify(res, null, 2));
    const {data: user} = res
    return user;
  } catch (error) {
    console.error(error);
  }
}

function App() {
  const [user, setUser] = useState<IUser>();
  const getData = async () => {
    const user:IUser | undefined  = await getUser();
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
