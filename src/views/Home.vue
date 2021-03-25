<template>
    <div class="home">
        <div class="home-nav clearfix">
            <div class="nav-text fl" @click="a">咖啡就是人生,苦与甜都包含其中。</div>
            <div class="nav-position fr nav-nav-img">
                <img src="../assets/image/saoyisao.png" alt="">
            </div>
            <div class="nav-scan fr nav-nav-img">
                <img src="../assets/image/weizhi.png" alt="">
            </div>
        </div>
        <!-- <div class="morning">早上好 !</div> -->
        <!-- 轮播图 -->
        <div class="banner">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,index) in bannerData" :key="index" @click="goDetail(item.pid)">
                    <img class="auto-img" :src="item.bannerImg" alt="">
                </van-swipe-item>
            </van-swipe>
        </div>
        <!-- 子导航 -->
        <div class="subTitle">
            <van-nav-bar>
                <template #left>
                    <span class="subText">新品推荐</span>
                </template>
                <template #right>
                    <span class="lookAll">查看全部</span>
                </template>
            </van-nav-bar>
        </div>
        <!-- 新品推荐 -->
        <div class="newpro">
            <div class="newpro-item">
                <img class="auto-img" src="http://www.kangliuyong.com:10002/images/product_small/IMG_0381_02p.jpg">
                <span>卡布奇诺</span>
            </div>
            <div class="newpro-item">
                <img class="auto-img" src="http://www.kangliuyong.com:10002/images/product_small/IMG_0381_02p.jpg">
                <span>卡布奇诺</span>
            </div>
            <div class="newpro-item">
                <img class="auto-img" src="http://www.kangliuyong.com:10002/images/product_small/IMG_0381_02p.jpg">
                <span>卡布奇诺</span>
            </div>
        </div>

        <!-- 子导航 -->
        <div class="subTitle">
            <van-nav-bar>
                <template #left>
                    <span class="subText">今日热卖</span>
                </template>
                <template #right>
                    <span class="lookAll">查看全部</span>
                </template>
            </van-nav-bar>
        </div>
        <!-- 今日优惠 -->
        <div class="discounts">
            <van-card
            :price="item.price"
            :desc="item.enname"
            :title="item.name"
            :thumb="item.smallImg"
            v-for="(item,index) in hotProData" 
            :key="index"
            @click="goDetail(item.pid)"
            />
        </div>
    </div>
</template>

<script>
    import "../assets/less/home.less"
    export default {
        name:"Home",
        data() {
            return {
                bannerImg:[
                    "../assets/image/anni1.png",
                    "../assets/image/anni2.png",
                ],
                //热卖商品
                hotProData:{},
                //轮播图数据
                bannerData:{},

            }
        },
        created(){
            this.getHotProduct();
            this.getBannerData();
        },
        methods:{
            a(){
                
                

            },
            //获取商品热卖数据
            getHotProduct(){
                this.axios({
                    method:"GET",
                    url:"/typeProducts",
                    params:{
                        appkey : this.appkey,
                        key: 'isHot',
                        value: 1
                    }
                }).then(result => {
                    this.hotProData = result.data.result;
                })
            },
            getBannerData(){
                this.axios({
                    method:"GET",
                    url:"/banner",
                    params:{
                        appkey : this.appkey,
                    }
                }).then(result => {
                    // 
                    this.bannerData = result.data.result;
                })
            },
            goDetail(pid){
               this.$router.push({name:"Detail",params:{pid}}) 
            },
            
        }

    }
</script>

<style lang="less" scoped>

</style>