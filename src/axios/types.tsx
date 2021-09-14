import AxiosInterceptorManager from './AxiosInterceptorManager';
export type Methods = 'get'|'GET'|'post'|'POST'|'put'|'PUT'|'delete'|'DELETE'|'options'|'OPTIONS';
export interface AxiosRequestConfig {
  url?: string;
  method?: Methods;
  params?: Record<string, any>,
  headers?: Record<string, any>,
  data?: Record<string, any>,
  timeout?: number,
  transformRequest?: (data: Record<string, any>, headers: any) => any; 
  transformResponse?: (response: Record<string, any>) => any; 
}
export interface AxiosInstance {
  // Promise 的范型 T 代表此 Promise 变成成功态之后 resolve 的值 resolve(value)
  <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response:AxiosInterceptorManager<AxiosResponse>;
  }
  create?: (config: AxiosRequestConfig) => AxiosInstance;
}

export interface AxiosResponse <T=any> {
  data: T;
  status: number;
  statusText: string;
  headers?: Record<string, any>;
  config?: AxiosRequestConfig;
  request?: XMLHttpRequest;
}