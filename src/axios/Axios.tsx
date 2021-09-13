import {AxiosRequestConfig, AxiosResponse} from './types';
import qs from 'qs';
import parseHeaders from 'parse-headers';
import AxiosInterceptorManager, {Interceptor} from './AxiosInterceptorManager';

export default class Axios<T> {
  public interceptors = {
    request: new AxiosInterceptorManager<AxiosRequestConfig>(),
    response: new AxiosInterceptorManager<AxiosResponse<T>>()
  }
  // T 用来限制响应对象 response 里的 data 的类型
  request(config: AxiosRequestConfig): Promise<AxiosRequestConfig|AxiosResponse<T>> {
    // return this.dispatchRequest(config);
    const chain: Array<Interceptor<AxiosRequestConfig>|Interceptor<AxiosResponse<T>>> = [{
      onFulfilled: this.dispatchRequest,
      onRejected: error => error
    }];
    this.interceptors.request.interceptors.forEach((interceptor:Interceptor<AxiosRequestConfig>|null) => {
      // todo: 请求拦截器先进后出
      // [request1,request] => [request1,request2,request] => [request1,request2,request3,request]
      interceptor && chain.unshift(interceptor);
    });
    this.interceptors.response.interceptors.forEach((interceptor: Interceptor<AxiosResponse<T>>|null) => {
      // todo: 响应拦截器先进先出
      interceptor && chain.push(interceptor);
    });
    let promise: Promise<AxiosRequestConfig|AxiosResponse<T>> = Promise.resolve(config);
    while(chain.length) {
      const {onFulfilled, onRejected} = chain.shift()!; // ! 断言不为空
      promise = promise.then(onFulfilled as any, onRejected);
    }
    return promise;
  }
  // 派发请求的方法
  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
      const request = new XMLHttpRequest();
      let {method, url, params, headers, data, timeout} = config;
      let paramsStr;
      let body: string | null = null;
      if(params && typeof params === 'object') {
        paramsStr = qs.stringify(params);
        url += (url?.indexOf('?') !== -1 ? '&': '?') + paramsStr;
      }
      request.open(method!, url!, true);
      request.responseType = 'json';
      request.onreadystatechange = function() {
        if(request.readyState === 4 && request.status !== 0) {
          if(request.status >= 200 && request.status < 300) {
            const {response, status, statusText} = request;
            const headers = parseHeaders(request.getAllResponseHeaders());
            const res: AxiosResponse<T> = {
              data: response || request.responseText,
              status,
              statusText,
              headers,
              config,
              request
            }
            resolve(res);
          } else {
            // todo:状态码错误
            reject(`Error: Request failed with status code ${request.status}`);
          }
        }
      }
      if(headers) {
        for (const key in headers) {
          request.setRequestHeader(key, headers[key]);
        }
      }
      if(data) {
        body = JSON.stringify(data);
      }
      // todo:网络错误
      request.onerror = () => {
        reject('net::ERR_INTERNET_DISCONNECTED');
      }
      // todo:超时错误
      if(timeout) {
        request.timeout = timeout;
        request.ontimeout = () => {
          reject('Error: timeout of 1000ms exceeded');
        }
      }
      request.send(body);
    })
  }
}
