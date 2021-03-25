<template>
    <div class="account">
        <div class="navBar">
            <van-nav-bar
                title="个人资料"
                left-text="返回"
                left-arrow
                @click-left="goBack"
            />
        </div>
        <bg-box>
            <div class="navList">
                 <van-cell-group center>
                     <van-cell  title="头像" center>
                           <template #right-icon>
                              <div class="userImg">
                                 <van-image
                                    width="90px"
                                    height="90px"
                                    round
                                    fit="cover"
                                    :src="accountInfo.userImg"
                                 />
                                 <van-uploader class="upload-box" :after-read="uploadImg"/>
                              </div>
                           </template>
                     </van-cell>
                    <van-cell title="手机号" :value="accountInfo.phone"/>
                    <van-cell title="用户id" :value="accountInfo.userId"/>
                    <van-field 
                        v-model="accountInfo.nickName" 
                        label="昵称"
                        placeholder="输入昵称" 
                        autosize
                        input-align="right"
                        rows="2"
                        @change="updateNickName"
                        />
                    <van-field 
                        v-model="accountInfo.desc" 
                        label="简介"
                        placeholder="输入简介" 
                        autosize
                        input-align="right"
                        rows="2"
                        maxlength="30"
                        show-word-limit
                        @change="updateDesc"
                        />
                </van-cell-group>
            </div>
        </bg-box>
    </div>
</template>

<script>
import bgBox from '../components/bgBox.vue'
   export default {
      components: { bgBox },
      name:"Account",
      data(){
        return {
          accountInfo:{
              nickName: '',
              desc: '',
              phone: '',
              userId: '',
              desc: ''
          },
        }
      },
      created(){
          this.getAccountInfo()
      },
      methods:{
        goBack(){
              this.$router.go(-1)
        },
        //获取个人资料
        getAccountInfo(){
            let tokenString = localStorage.getItem("__tk");
            //检测用户有没有登录
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
              method:"GET",
              url:"/findAccountInfo",
              params:{
                  appkey:this.appkey,
                  tokenString
              } 
            }).then(result => {
              this.$toast.clear();
              if(result.data.code == 700){
                  this.$router.push({name:"Login"})
              }else if(result.data.code == "B001"){
                  let data = result.data.result[0];
                  if(data.desc == ""){
                        data.desc = "这家伙很懒，什么都没有留下"
                  }
                  this.accountInfo = data
              }
            })
        },
        //上传用户头像
        uploadImg(file){
          //图片支持的格式
          let type = ["png" , 'jpg' , "jpeg" ,'gif']
          //允许最大文件大小
          let size = 1
          //判断文件类型
          let fileType = file.file.type.split('/')[1];

          if(type.indexOf(fileType) == -1){
              this.$toast(`文件只支持${type.join(",")}`)
              return
          }

          let fileSize = file.file.size / 1024 / 1024

          if(fileSize > size){
              this.$toast(`文件允许最大不能超过${size}MB`)
              return;
          }

              //处理base64的标记data:image/jpeg;base64,
          let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');
          
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
              url:"/updateAvatar",
              data:{
                appkey: this.appkey,
                tokenString,
                imgType: fileType,
                serverBase64Img: base64
              }
          }).then(result => {
              this.$toast.clear();
              if(result.data.code == 700){
                this.$router.push({name:"Login"})
              }else if(result.data.code == "H001"){
                this.accountInfo.userImg = result.data.userImg;
              }
              this.$toast(result.data.msg);
          })
        },
        //修改昵称
        updateNickName(){
          if (!this.accountInfo.nickName) {
              this.$toast('昵称不能为空');
          }

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
              url:"/updateNickName",
              data:{
                appkey: this.appkey,
                tokenString,
                nickName: this.accountInfo.nickName
              }
          }).then(result => {
              this.$toast.clear();
              if(result.data.code == 700){
                this.$router.push({name:"Login"})
              }else{
                this.$toast(result.data.msg)
              }
          })
        },
        //修改简介
        updateDesc(){

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
              url:"/updateDesc",
              data:{
                appkey: this.appkey,
                tokenString,
                desc: this.accountInfo.desc
              }
          }).then(result => {
              this.$toast.clear();
              if(result.data.code == 700){
                this.$router.push({name:"Login"})
              }else{
                this.$toast(result.data.msg)
              }
          })
        }
      }
   }
</script>

<style lang="less" scoped>
   .account{
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      .navBar{
         /deep/.van-icon{
               color: #0c34ba;
         }
         /deep/.van-nav-bar__text{
               color: #0c34ba;
         }
      }
      .navList{
            background-color: #ffffff;
            .userImg{
               position: relative;
               .upload-box{
                  position: absolute;
                  width: 90px;
                  height: 90px;
                  left: 0;
                  top: 0;
                  opacity: 0;
                  /deep/.van-uploader__wrapper{
                     height: 100%;
                  }
                  /deep/.van-uploader__upload{
                     width: 90px;
                     height: 90px;
                     border-radius: 50%;
                     margin: 0;
                  }
               }

            }
            .jj{
               padding: 10px 16px;
               font-size: 14px;
            }
            p{
               padding: 10px 16px 20px;
               color: #999999;
            }
            /deep/.van-field__word-limit{
               margin-top: 30px;
            }
      }
   }
</style>