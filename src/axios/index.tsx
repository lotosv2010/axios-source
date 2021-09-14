import Axios from './Axios';
import {AxiosInstance} from './types';
import {isCancel, CancelToken} from './cancel';

/**
 * 创建一个axios实例
 * axios其实就是一个函数
 */
function createInstance(): AxiosInstance {
  const context: Axios<any> = new Axios(); // this指针上下文
  // 让 request 方法里的this永远指向context 也就是 new Axios()
  let instance = Axios.prototype.request.bind(context);
  // 把 Axios 的类的实例和类的原型上的方法都拷贝到了 instance 上，也就是 request 方法上
  instance = Object.assign(instance, Axios.prototype,context);

  return instance as AxiosInstance;
}
const axios = createInstance();
axios.CancelToken = new CancelToken();
axios.isCancel = isCancel;
export default axios;
export * from './types';