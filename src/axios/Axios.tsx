import {AxiosRequestConfig, AxiosResponse} from './types';
import qs from 'qs';
import parseHeaders from 'parse-headers';

export default class Axios {
  // T 用来限制响应对象 response 里的 data 的类型
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.dispatchRequest(config);
  }
  // 派发请求的方法
  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
      const request = new XMLHttpRequest();
      let {method, url, params, headers, data} = config;
      let paramsStr;
      let body: string | null = null;
      if(params && typeof params === 'object') {
        paramsStr = qs.stringify(params);
        url += (url?.indexOf('?') !== -1 ? '&': '?') + paramsStr;
      }
      request.open(method!, url!, true);
      request.responseType = 'json';
      request.onreadystatechange = function() {
        if(request.readyState === 4) {
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
            reject('请求失败');
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
      request.send(body);
    })
  }
}
