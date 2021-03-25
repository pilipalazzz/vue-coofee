<template>
    <div class="menu">
        <div class="home-nav clearfix">
            <div class="nav-text fl" >咖啡就是人生,苦与甜都包含其中。</div>

            <div class="nav-position fr nav-nav-img">
                <img src="../assets/image/saoyisao.png" alt="">
            </div>

            <div class="nav-scan fr nav-nav-img">
                <img src="../assets/image/weizhi.png" alt="">
            </div>
        </div>

        <div class="search">
          <span class="search-text">下午好，{{userInfo.nickName}}</span>
          <input type="text" placeholder="请输入商品名称" @focus="searchFocus">
          <van-icon name="search" class="aa" color="#0c34ba"/>
        </div>

        <div class="morning">今天想喝点什么呢？</div>

        <div class="subNav">
          <div class="nav-list" v-for="(item,index) in menuTitData" :key="index" @click="toggleMenu(index,item.type)">
            <img :src="currentIndex == index ? item.activeIcon : item.inactiveIcon " >
            <span :class="{ active : currentIndex == index }">{{item.title}}</span>
          </div>
        </div>

        <div class="nav-content">
          <div class="nav-item" v-for="(item,index) in productData" :key="index" @click="goDetail(item.pid)">
            <div class="left">
              <div class="img">
                <img class="auto-img" :src="item.smallImg" >
              </div>
            </div>
            <div class="right">
              <div class="name">{{item.name}}</div>
              <div class="enname">{{item.enname}}</div>
              <div class="price-box clearfix">
                <div class="price fl">￥{{item.price}}</div>
              </div>
            </div>
          </div>
        </div>

       

    </div>
</template>

<script>
import ('../assets/less/menu.less')

    export default {
        name:"Menu",
        
        data(){
          return {
            // 默认激活
            currentIndex:0,
              //咖啡导航标题
            menuTitData : [
              {
                title: "推荐",
                //未激活标签
                inactiveIcon: require("../assets/image/icons_09.gif"),
                activeIcon: require("../assets/image/icons_21.gif"),
              },
              {
                title: "拿铁",
                inactiveIcon: require("../assets/image/icons_05.gif"),
                activeIcon: require("../assets/image/icons_19.gif"),
              },
              {
                title: "咖啡",
                inactiveIcon: require("../assets/image/icons_03.gif"),
                activeIcon: require("../assets/image/icons_18.gif"),
              },
              {
                title: "瑞纳冰",
                inactiveIcon: require("../assets/image/icons_07.gif"),
                activeIcon: require("../assets/image/icons_20.gif"),
              },
            ],
            //当前渲染的商品数据
            productData:{},

            rule:"无糖/热",
            userInfo:{}
          }
        },
        created(){
          this.getProType();
        },
        methods:{
          toggleMenu(index,type){
            if(this.currentIndex == index){
              return;
            }
            this.currentIndex = index;
            this.getDataByType(type)
          },
          //获取商品类型
          getProType(){
            this.$toast.loading({
              message: "加载中...",
              forbidClick: true,
              duration: 0,
            });

            this.axios({
              method: "GET",
              url: "/type",
              params: {
                appkey: this.appkey
              },
            }).then(result => {
              this.$toast.clear();

              if (result.data.code == 400){
                let data = result.data.result;
                data.unshift({
                  type: 'isHot',
                  typeDesc: '推荐'
                })

                this.menuTitData.map(v => {
                  for(let i = 0; i < data.length; i++){
                    if(v.title == data[i].typeDesc){
                      v.type = data[i].type
                      break;
                    }
                  }
                })

                let type = this.menuTitData[this.currentIndex].type;
                this.getDataByType(type)
              }
            }).catch(err => {
              this.$toast.clear();
            })
          },
          getDataByType(type){
            this.$toast.loading({
              message: "加载中...",
              forbidClick: true,
              duration: 0,
            });

            let params = {
              appkey: this.appkey
            }
            if(type == "isHot"){
              params.key = 'isHot',
              params.value = 1
            }else{
              params.key = 'type';
              params.value = type
            }
            this.axios({
              method: "GET",
              url: "/typeProducts",
              params
            }).then(result => {
              this.$toast.clear();
              if(result.data.code == 500){
                this.productData = result.data.result
              }
            }).catch(err => {
              this.$toast.clear();
            })
          },
          goDetail(pid){
            this.$router.push({name:"Detail",params:{pid}})
          },
          searchFocus() {
              this.$router.push({name: 'Search'});
          },
         
        }
        
    }
</script>

<style lang="less" scoped>

</style>