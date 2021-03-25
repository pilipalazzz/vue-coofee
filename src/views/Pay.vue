<template>
    <div class="pay">
        <div class="navBar">
            <van-nav-bar
                title="确认订单"
                left-text="返回"
                left-arrow
                @click-left="goBack"
            />
        </div>
        <div class="pay-content">
            <div class="address">
                <button @click="show">选择收货地址 ></button>
                <div class="addressInfo">
                    <div class="top">
                        <span class="top-name">{{currentList.name}}</span>
                        <span class="top-tel">{{currentList.tel}}</span>
                    </div>
                    <div class="bottom">{{currentList.address}}</div>
                </div>
            </div>
            <!-- 订单信息盒子 -->
            <div class="proInfo-box">
                <h3>订单信息</h3>
                <!-- 订单信息 -->
                <div class="proInfo" v-for="(item,index) in productData" :key="index">
                    <div class="proInfo-left">
                        <img class="auto-img" :src="item.small_img">
                    </div>
                    <div class="proInfo-right">
                        <div class="proInfo-title">
                            <span class="name">{{item.name}}</span>
                            <span class="pro-rule">{{item.rule}}</span>
                        </div>
                        <div class="enname">{{item.enname}}</div>
                        <div class="priceAndCount clearfix">
                            <div class="price fl">￥{{item.price}}</div>
                            <div class="count fr">x{{item.count}}</div>
                        </div>
                    </div>
                </div>
                <div class="total-box clearfix">
                    <div class="total-count fl">共计 {{productInfo.count}} 件商品</div>
                    <div class="total-price fr">合计￥{{productInfo.total}}</div>
                    <div class="circle1"></div>
                    <div class="circle2"></div>
                </div>
            </div>
            <!-- 结算 -->
            <div class="Settlement">
                <van-button color="#0c34ba" size="large" round @click="payBox">立即结算</van-button>
            </div>
            <van-popup 
            v-model="isShow" 
            position="bottom" 
            :style="{ height: '30%' }">
                <van-address-list
                    v-model="chosenAddressId"
                    :list="list"
                    @add="goNewAddress"
                    @select="selectAdreess"
                />

            </van-popup>
        </div>
    </div>
</template>

<script>
    import ("../assets/less/pay.less")
    export default {
        name:"Pay",
        data(){
            return {
               //选择的地址id
                chosenAddressId:1,
                
                isShow:false,
                //地址列表信息
                list:[],
                //选择的地址
                currentList:[],
                //需要购买的商品sid
                sids:[],
                //需要购买的商品数据
                productData:{},
                //数量和总价钱
                productInfo:{
                    count:0,
                    total:0
                }
            }
        },
        created(){
            // 截取传入的sid
            this.sids = this.$route.query.sids.split("-")
            //获取地址列表
            this.getAdreessData()
            this.getProductData()
        },
        methods:{
            goBack(){
                this.$router.go(-1);
            },
            show(){
                this.isShow = !this.isShow
            },
            goNewAddress(){
                this.$router.push({name:"NewAddress"})
            },
            //获取地址列表
            getAdreessData(){
                let tokenString = localStorage.getItem('__tk');

                if (!tokenString) {
                //跳回登录页面
                this.$toast('请先登录');
                return this.$router.push({name: 'Login'});
                }
                this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0
                });

                this.axios({
                    method: 'GET',
                    url: '/findAddress',
                    params: {
                        appkey: this.appkey,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 700){
                        this.$router.push({name:"Login"});
                    }else if(result.data.code == 20000){
                        result.data.result.map(v => {
                            v.id = v.aid;
                            v.isDefault = Boolean(v.isDefault)
                            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`
                        })
                        this.list = result.data.result
                    }
                })
            },
            // 选择地址
            selectAdreess(item){
                this.isShow = false,
                this.currentList = item
            },
            //通过sid获取商品数据
            getProductData(){
                let tokenString = localStorage.getItem('__tk');

                if (!tokenString) {
                //跳回登录页面
                this.$toast('请先登录');
                return this.$router.push({name: 'Login'});
                }
                this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0
                });
                this.axios({
                    method:"GET",
                    url:"/commitShopcart",
                    params:{
                        appkey:this.appkey,
                        tokenString,
                        sids:JSON.stringify(this.sids)
                        
                    }
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 700){
                        this.$router.push({name: 'Login'});
                    }else if(result.data.code == 50000){
                        if(result.data.result.length == 0){
                            this.$router.push({name:"Shopbag"})
                        }
                        result.data.result.map(v => {
                            this.productInfo.count += v.count
                            this.productInfo.total += v.count * v.price
                        })
                        this.productData = result.data.result
                    }
                }).catch(err => {
                    this.$toast.clear();
                })
            },
            //结算订单
            pay(){
                let tokenString = localStorage.getItem('__tk');

                if (!tokenString) {
                //跳回登录页面
                this.$toast('请先登录');
                return this.$router.push({name: 'Login'});
                }
                this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0
                });

                this.axios({
                    method:"POST",
                    url:"/pay",
                    data:{
                        appkey: this.appkey,
                        tokenString,
                        sids: JSON.stringify(this.sids),
                        phone: this.currentList.tel,
                        address: this.currentList.address,
                        receiver: this.currentList.name
                    }
                }).then(result => {
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        //token检验无效,则跳到登录页面
                        this.$router.push({ name: "Login" });
                    } else {
                        this.$toast(result.data.msg);
                        setTimeout(() => {
                            //跳转到订单页面
                            this.$router.push({name: 'Order'});
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
                            
            },
            //结算提示
            payBox(){
                this.$dialog.confirm({
                    title:"确认订单",
                    message:"是否立即结算?",
                    confirmButtonColor: '#0C34BA'
                }).then(() => {
                  if(this.currentList == ""){
                    this.$toast("请选择收货地址！")
                    return;
                  }
                    //点击确认之后调用结算订单方法
                    this.pay()
                }).catch(err => {
                    
                })
            }

        }
    }
</script>

<style lang="less" scoped>
    .navBar{
        /deep/.van-icon{
            color: #0c34ba;
        }
        /deep/.van-nav-bar__text{
            color: #0c34ba;
        }
    }
</style>