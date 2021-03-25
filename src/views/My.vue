<template>
    <div class="my">
        <div class="bgImg" :style="{backgroundImage:`url('${userInfo.userBg}')`}">
            <van-uploader class="upload-box"  :after-read="uploadBg"/>
        </div>
        <div class="my-content">
            <div class="my-title">
               <div class="title-left">
                  <van-image
                     width="90px"
                     height="90px"
                     round
                     fit="cover"
                     :src="userInfo.userImg"
                  />
               </div>
               <div class="title-right">
                  <div class="username">{{userInfo.nickName}}</div>
                  <div class="signature">{{userInfo.desc}}</div>
               </div>
            </div>
            
            <div class="navList">
               <van-cell-group center>
                  <van-cell v-for="(item,index) in navData" :key="index" :title="item.title" is-link :to="item.name"/>
               </van-cell-group>
            </div>
        </div>
    </div>
</template>

<script>
    import ("../assets/less/my.less")
   export default {
      name:"Name",
      data(){
            return {
               navData : [
                  {
                     title:"个人资料",
                     name:"Account"
                  },
                  {
                     title:"我的订单",
                     name:"Order"
                  },
                  {
                     title:"我的收藏",
                     name:"Favorite"
                  },
                  {
                     title:"收货地址",
                     name:"Address"
                  },
                  {
                     title:"安全中心",
                     name:"Secure"
                  },
               ],
               userInfo:{},
               bgc:"../assets/image/anni2.jpg"
            }
      },
      created(){
         this.getUserInfo()
      },
      methods:{
         //获取用户信息
         getUserInfo(){
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
                  url:"/findMy",
                  params:{
                     appkey: this.appkey,
                     tokenString
                  }
               }).then(result => {
                  this.$toast.clear();
                  // 
                  if (result.data.code == 700) {
                      //token检验无效,则跳到登录页面
                      this.$router.push({ name: "Login" });
                  } else if (result.data.code == 'A001') {
                      this.userInfo = result.data.result[0];
                  }
               }).catch(err => {
                  this.$toast.clear();
                  
               })
         },
         // 上传背景
         uploadBg(file){
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
               url:"/updateUserBg",
               data:{
                  appkey: this.appkey,
                  tokenString,
                  imgType: fileType,
                  serverBase64Img: base64
               }
            }).then(result => {
               this.$toast.clear();
               
               if(result.data.code == 700){
                  this.$router.push("Login")
               }else if(result.data.code == "I001"){
                  this.userInfo.userBg = result.data.userBg;
               }
               this.$toast(result.data.msg);
            }).catch(err => {
               this.$toast.clear();
               
            })
         }
      }
   }
</script>

<style lang="scss" scoped>

</style>