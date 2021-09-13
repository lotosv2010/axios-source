export type Methods = 'get'|'GET'|'post'|'POST'|'put'|'PUT'|'delete'|'DELETE'|'options'|'OPTIONS';
export interface AxiosRequestConfig {
  url: string;
  method: Methods;
  params: Record<string, any>
}
export interface AxiosInstance {
  // Promise 的范型 T 代表此 Promise 变成成功态之后 resolve 的值 resolve(value)
  <T = any>(config: AxiosRequestConfig): Promise<T>;
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