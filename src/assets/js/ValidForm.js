import Vue from 'vue'

//局部导入提示组件
import { Toast } from 'vant'

//局部注册提示组件
Vue.use(Toast)
//表单验证
class ValidForm {
    constructor() {}
    //传入一个对象
    valid(obj){
        //遍历对象
        for(let key in obj){
            //验证正则表达式
            if(!obj[key].reg.test(obj[key].value)){
                //打印错误信息
                Toast(obj[key].msg)
                //表单验证不通过
                return false;
            }
        }
        return true;
    }

}
//导出表单验证实例
export const validForm = new ValidForm();
