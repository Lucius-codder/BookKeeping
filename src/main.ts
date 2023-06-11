import { createApp } from "vue";
import App from "./App.vue";
import routes from "./router";
import { createRouter, createWebHistory } from 'vue-router'
import store from "./store";
import Vant from "vant";
import "./public-path.js"
// import axios from "axios";
import "vant/lib/index.css";
import "amfe-flexible/index";

let router = null
let instance: any = null
let history: any = null

function render (props = {}) {
  const { container } = props as any
  history = createWebHistory((window as any).__POWERED_BY_QIANKUN__ ? '/vue' : '/')
  router = createRouter({
    history,
    routes
  })
  instance = createApp(App)
  instance.use(Vant);
  instance.use(router)
  instance.use(store)
  instance.mount(container ? container.querySelector('#app') : '#app')
}


// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
 export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  render(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  instance.unmount()
  instance._container.innerHTML = ''
  instance = null
  router = null
  history.destroy()
}

