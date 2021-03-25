<template>
    <div class="favorite">
        <van-nav-bar
            title="我的收藏"
            left-text="返回"
            left-arrow
            @click-left="goBack"
        />
        <bg-box>
          <div class="fav-content">
            <!-- 收藏列表 -->
            <div class="fav-list" v-if="this.favoriteData.length > 0">
              <div class="fav-item" v-for="(item,index) in favoriteData" :key="index">
                <div class="img" @click="goDetail(item.pid)">
                  <img class="auto-img" :src="item.smallImg">
                </div>
                <div class="fav-name">{{item.name}}</div>
                <div class="fav-price clearfix">
                  <div class="fl">￥{{item.price}}</div>
                  <div class="fr del" @click="removeLikeProduct(item.pid,index)">
                    <img class="auto-img" :src="require('../assets/image/shanchu.png')">
                  </div>
                </div>
              </div>
              
            </div>
            <div v-else>
                <van-empty description="没有关注的内容哦，先去逛一逛吧" />
            </div>
          </div>
        </bg-box>

    </div>
</template>

<script>
import bgBox from '../components/bgBox.vue'

  export default {
    name:"Favorite",
    data(){
      return {
        //收藏数据
        favoriteData:{}
      }
    },
    created(){
      this.getLikeProduct()
    },
      methods:{
        goBack(){
            this.$router.go(-1)
        },
        //获取收藏数据
        getLikeProduct(){
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
            method:"GET",
            url:"/findAllLike",
            params:{
              appkey: this.appkey,
              tokenString
            }
          }).then(result => {
            this.$toast.clear();
            if(result.data.code == 700){
              this.$router.push({name:"Login"})
            }else if(result.data.code == 2000){
              this.favoriteData = result.data.result
            }
          }).catch(err => {
            this.$toast.clear();
          })
        },
        //删除收藏数据
        removeLikeProduct(pid,index){
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
            url:"/notlike",
            data:{
              appkey: this.appkey,
              pid,
              tokenString
            }
          }).then(result => {
            this.$toast.clear();
            if(result.data.code == 700){
              this.$router.push({name :"Login"})
            }else if(result.data.code == 900){
              this.$toast("删除成功")
              this.favoriteData.splice(index,1)
            }else{
              this.$toast("删除失败")
            }
          }).catch(err => {
            this.$toast.clear();
          })
        },
        //查看详情
        goDetail(pid){
          this.$router.push({name:"Detail",params:{pid}})
        }
    },
    components: { 
      bgBox 
    }
  }
</script>

<style lang="less" scoped>
    .favorite{
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      /deep/.van-icon{
          color: #0c34ba;
      }
      /deep/.van-nav-bar__text{
          color: #0c34ba;
      }
      .fav-content{
        background-color: #fff;
        padding: 15px 15px;
        .fav-list{
          display: flex;
          flex-wrap: wrap;
          .fav-item{
            padding: 10px 0;
            width: 163px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .img{
              width: 140px;
              height: 140px;
              overflow: hidden;
              border-radius: 10px;
            }
            .fav-name{
              font-size: 16px;
              font-weight: bold;
              width: 80%;
              margin: 10px 0;
            }
            .fav-price{
              width: 80%;
              font-size: 14px;
              font-weight: bold;
              color: #0c34ba;
              line-height: 24px;
              .del{
                width: 24px;
                height: 24px;
              }
            }
          }
        }
      }
      
    }
</style>