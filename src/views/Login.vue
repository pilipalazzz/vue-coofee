<template>
  <div class="login">

    <van-nav-bar
      left-text="返回"
      right-text="随便看看"
      @click-right="goHome"
    >
      <template #left>
        <div class="nav-left">
          <div class="logo">
            <img class="auto-img" src="../assets/image/home_active.png" alt="">
          </div>
          <div class="logo-text">Remier Coffee</div>
        </div>
      </template>
    </van-nav-bar>

    <div class="user-box">
      <div class="user-title">
        <div class="welcome">您好，请登录!</div>
        <div class="sub-title">Please login to your accounts</div>
      </div>

      <van-form>

        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="请输入密码"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleRegsiterPasswordType"
        />
        <div class="forgot">
          <span @click="goForgot">忘记密码?</span>
        </div>

        <div class="commit-btn">
          <van-button round block color="#0C34BA" @click="login">
            登录
          </van-button>
        </div>
        <div class="commit-btn">
          <van-button round block type="default" @click="toggleRegisterBox">
            注册
          </van-button>
        </div>
      </van-form>

    </div>

    <!-- 注册 -->
    <van-popup class="register-box" v-model="isShow" position="bottom" closeable>
       <div class="register-title">注册</div>
       <van-form>

        <van-field
          v-model="userRegisterInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入11位手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userRegisterInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="密码必须为字母开头"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'" 
          autocomplete="off"
          @click-right-icon="toggleRegsiterPasswordType"
        />

        <van-field
          v-model="userRegisterInfo.nickName"
          name="昵称"
          label="昵称"
          placeholder="请输入昵称"
          autocomplete="off"
        />

        <div class="commit-btn register-btn">
          <van-button round block color="#0C34BA" @click="register">
            注册
          </van-button>
        </div>
      </van-form>

    </van-popup>

  </div>
</template>

<script>
  //导入外部样式表
  import '../assets/less/login.less'

  //导入表单验证模块
  import {validForm} from '../assets/js/ValidForm'

  export default {
    name: 'Login',
    data() {

      return {
        //用户登录信息
        userInfo: {
          phone: '',
          password: ''
        },

        //用户注册信息
        userRegisterInfo: {
          phone: '',
          password: '',
          nickName: ''
        },

        //是否显示注册框
        isShow: false,

        //切换注册密码框的类型
        isRegisterPassword: true
      };
    },
    methods: {

      //切换注册框
      toggleRegisterBox() {
        this.isShow = true;
      },

      //切换注册密码框的类型
      toggleRegsiterPasswordType() {
        this.isRegisterPassword = !this.isRegisterPassword;
      },

      //注册
      register() {
        //构造表单验证信息
        let verifyInfo = {
          phone:{
              value: this.userRegisterInfo.phone,
              reg:/^1[3-9]\d{9}$/,
              msg:"手机号格式有误"
          },
          password:{
              value: this.userRegisterInfo.password,
              reg:/^[a-zA-Z]\w{7,15}$/,
              msg:"密码格式有误"
          },
          nickName:{
              value: this.userRegisterInfo.nickName,
              reg:/^[\w\u4e00-\u9fa5]{2,8}$/,
              msg:"昵称格式有误"
          },
        };
        //判断是否验证通过  true / false
        let isPass = validForm.valid(verifyInfo);

        if (isPass) {
          //复制一份注册数据     Object.assign(obj1,obj2)(合并对象)
          let userInfo = Object.assign({} , this.userRegisterInfo);
          userInfo.appkey = this.appkey;
          //加载提示
          this.$toast.loading({         
              message: '加载中...',
              //禁止点击
              forbidClick: true,
          });
          
          //发起注册请求
          this.axios({
              // 请求方法
              method : "POST",
              // 请求地址  (因为设置了请求基础路径，所以可以简写)
              url : "/register",
              // 请求参数
              data:userInfo,
              //处理post请求的参数 ，对参数进行序列化(在main.js里进行了，以便后续使用,否则要写在这里)
          
          }).then(result => {
              //关闭提示
              this.$toast.clear();
              //注册成功提示
              this.$toast.success(result.data.msg)
              if(result.data.code == 100){
                    this.isShow = false
              }
              
          }).catch(err => {
              //关闭提示
              this.$toast.clear();
              // 注册失败提示
              this.$toast.success(result.data.msg)
              
          })
        }
               
      },

      //登录
      login() {
        //表单验证信息
        let verifyInfo = {
          phone:{
              value: this.userInfo.phone,
              reg:/^1[3-9]\d{9}$/,
              msg:"手机号或密码输入错误"
          },
          password:{
              value: this.userInfo.password,
              reg:/^[a-zA-Z]\w{7,15}$/,
              msg:"手机号或密码输入错误"
          },
        };
        let isPass = validForm.valid(verifyInfo);
        if(isPass){
          let userInfo = Object.assign({},this.userInfo);
          userInfo.appkey = this.appkey;
          this.$toast.loading({         
              message: '登录中...',
              //禁止点击背景
              forbidClick: true,
              duration: 0
          });
          this.axios({
              method:"POST",
              url:"/login",
              data:userInfo
          }).then(result => {
              this.$toast.clear();
              if(result.data.code == 200){
                    //注册成功提示
                    this.$toast("登录成功，欢迎回来")
                    this.$router.push({name:"Home"})
                    localStorage.setItem('__tk', result.data.token);
              }else{
                    this.$toast(result.data.msg)
              }
              
          })
        }
      },

      //跳转页面
      goHome() {
        this.$router.push({name:"Home"});
      },
      goForgot(){
        this.$router.push({name:"Forgot"});
      }
    }
  }
</script>