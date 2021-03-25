<template>
  <div class="secure">
      <div class="navBar">
         <van-nav-bar
         title="安全中心"
         left-text="返回"
         left-arrow
         @click-left="goBack"
         />
      </div>
      <bg-box>
         <div class="content">
            <van-cell-group>
               <van-cell title="修改密码" is-link @click="isOpen" />
               <van-cell title="注销账户" is-link @click="unsubscribe"/>
            </van-cell-group>
            <div class="btn" style="margin-top:100px">
               <van-button round block type="info" native-type="submit" @click="quit">
                  退出登录
               </van-button>
            </div>
         </div>
      </bg-box>
      <div class="changePass">
         <van-popup v-model="showPop" position="bottom" closeable>
            <div class="title">修改密码</div>
            <van-form >
               <van-field
                     name="旧密码"
                     label="旧密码"
                     placeholder="6-16位密码且以字母开头"
                     v-model="password.oldPass"
               />
               <van-field
                     type="password"
                     name="新密码"
                     label="新密码"
                     placeholder="6-16位密码且以字母开头"
                     v-model="password.newPass"
               />
               <div class="btn">
                     <van-button round block type="info" native-type="submit" @click="changePassword">
                        确认修改
                     </van-button>
               </div>
            </van-form>
         </van-popup>
      </div>
   </div>
</template>

<script>
import bgBox from "../components/bgBox.vue";
//引入表单验证模块
import {validForm} from "../assets/js/ValidForm"

export default {
  components: { bgBox },
  name: "Secure",
  data() {
    return {
      showPop: false,
      password:{
         // 旧密码
         oldPass:"",
         // 新密码
         newPass:""
      }
    };
  },
    methods: {
      goBack() {
          this.$router.go(-1);
      },
      isOpen() {
          this.showPop = !this.showPop;
      },
      //退出登录
      quit(){
          this.$dialog.confirm({
            title:"退出登录",
            message:"是否确认退出登录?",
            confirmButtonColor: "#0C34BA",
          }).then(() => {

            this.$toast.loading({
                message: "正在退出...",
                forbidClick: true,
                duration: 0,
            });

            setTimeout(() => {
                this.$toast.clear();
                localStorage.removeItem("__tk");
                this.$router.push("/")
            },800)
          }).catch(err => {
            this.$toast.clear();
          })
      },
      // 修改密码
      changePassword(){
          let o = {
            oldPassword:{
                value: this.password.oldPass,
                reg:/^[a-zA-Z]\w{7,15}$/,
                msg:"旧密码由数字字母下划线组合(6-16字符)"
            },
            newPassword:{
                value: this.password.newPass,
                reg:/^[a-zA-Z]\w{7,15}$/,
                msg:"新密码由数字字母下划线组合(6-16字符)"
            },
          };
          //表单验证
          let isPass = validForm.valid(o);

          if(isPass){
            if(this.password.newPass == this.password.oldPass){
                this.$toast("新密码不能与旧密码相同")
                return;
            }

            //发起修改密码请求
            let tokenString = localStorage.getItem("__tk");

            if (!tokenString) {
                //跳回登录页面
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" });
            }

            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });

            this.axios({
                method:"POST",
                url:"/updatePassword",
                data:{
                  appkey: this.appkey,
                  tokenString,
                  password: this.password.newPass,
                  oldPassword: this.password.oldPass
                }
            }).then(result => {
                this.$toast.clear();
                //token检测无效，跳转到登录
                if(result.data.code == 700){
                  this.$router.push("Login")
                }else if(result.data.code == "E001"){
                  //修改成功，清除登录状态,并跳转到登录页面
                  localStorage.removeItem("__tk");
                  this.$router.push({name:"Login"})
                  this.$toast(result.data.msg)
                }
            })
          }
      },
      //注销
      unsubscribe(){
          this.$dialog.confirm({
            title:"注销账户",
            message:"是否确定注销账户?一旦注销无法恢复!",
            confirmButtonColor: "#0C34BA",
          }).then( () => {
            //发起注销账户请求
            let tokenString = localStorage.getItem("__tk");

            if (!tokenString) {
            //跳回登录页面
            this.$toast("请先登录");
            return this.$router.push({ name: "Login" });
            }

            this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            });

            this.axios({
                method:"POST",
                url:"/destroyAccount",
                data:{
                  appkey: this.appkey,
                  tokenString
                }
            }).then(result => {
                this.$toast.clear();
                if(result.data.code == 700){
                  this.$router.push({name : "Login"})
                }else if(result.data.code == "G001"){
                  setTimeout(() => {
                      //清除登录状态
                      localStorage.removeItem("__tk");
                      this.$router.push({ name: "Login" });
                  }, 800);
                }
                this.$toast(result.data.msg)
            })
          })
      }


    },
};
</script>

<style lang="less" scoped>
.secure {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
   .navBar {
      /deep/.van-icon {
         color: #0c34ba;
      }
      /deep/.van-nav-bar__text {
         color: #0c34ba;
      }
   }
   .changePass{
      .title{
         padding: 20px 10px 30px;
         font-size: 18px;
      }
   }
   .btn{
      margin: 16px;
      margin-top: 50px;
      /deep/.van-button--info{
         background-color: #0c34ba;
         border-color: #0c34ba;
      }
   }
}
</style>