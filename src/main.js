import Vue from 'vue'
import App from './App.vue'
import router from './router'



//导入rem适配文件
import 'lib-flexible/flexible'
//导入axios
import axios from 'axios'

//导入vue-axios
import VueAxios from 'vue-axios'
//配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
//设置vue原型属性
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="

// axios参数拦截器,在发起请求之前执行。
axios.interceptors.request.use(config => {
  //判断请求方法是不是post请求，进行参数序列化
  if(config.method == "post"){
    let paramsString = "";
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`
    }
    //去掉多余的一个&符号  
    config.data = paramsString.slice(0,-1);
    
  }
  //必须返回config
  return config;
})

//从vant框架引入组件
import { 
  Button ,
  NavBar,
  Form,
  Field,
  Popup,
  Toast, //在这里引入的Toast是挂载在原型上的，所以使用时需要加this
  Tabbar, 
  TabbarItem,
  Swipe, 
  SwipeItem,
  Card,
  Stepper,
  Icon,
  Empty,
  Checkbox, 
  CheckboxGroup,
  SwipeCell,
  SubmitBar,
  AddressEdit,
  AddressList,
  Dialog,
  Tabs,
  Tab,
  Image as VanImage,
  CellGroup,
  Cell,
  Uploader,
  Search,
} from 'vant';



//注册组件
Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Card)
  .use(Stepper)
  .use(Icon)
  .use(Empty)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(AddressEdit)
  .use(AddressList)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(VanImage)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(Search)

Vue.use(VueAxios, axios)

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
