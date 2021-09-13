type OnFulFilled<V> = (value: V) => V | Promise<V>;
interface OnRejected {
  (error: any): any;
}

/**
 * 一个拦截器
 */
export interface Interceptor<V> {
  onFulfilled?: OnFulFilled<V>; // 成功的回调
  onRejected?: OnRejected; // 失败的回调
}

/**
 * 拦截器管理器
 * T 可能是 AxiosRequestConfig，也可能是 AxiosResponse
 */
export default class AxiosInterceptorManager<V> {
  public interceptors: Array<Interceptor<V>|null> = []; 
  use(onFulfilled?: OnFulFilled<V>, onRejected?: OnRejected): number {
    this.interceptors.push({
      onFulfilled,
      onRejected
    });
    return this.interceptors.length - 1;
  }
  eject(id: number): void {
    if(this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
