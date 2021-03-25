<template>
    <div class="detail">
        <!-- 商品图片 -->
        <div class="proImg">
            <img class="auto-img" :src="DetailData.large_img" >
            <div class="detail-nav clearfix">
                <div class="left fl" @click="goBack">
                    <img class="auto-img" src="../assets/image/back.png">
                </div>
                <div class="right fr">
                    <img src="../assets/image/fenxiang.png">
                </div>
            </div>
        </div>
        <!-- 商品内容 -->
        <div class="pro-content">
            <!-- 商品名字 -->
            <div class="pro-titleBox">
                <div class="pro-title">{{DetailData.name}}</div>
                <div class="pro-entitle">{{DetailData.enname}}</div>
                <!-- 收藏 -->
                <van-icon name="like" :color="isLike ? '#0c34ba' : '#cccccc'" size="24px" @click="likeProduct"/>
            </div>
            <!-- 商品规格 -->
            <div class="rule"  v-for="(item,index) in DetailData.rules" :key="index">
                <div class="title">{{item.title}}</div>
                <div class="selectBox clearfix">
                    <div class="select fl" :class="{active : item.ruleIndex == i}"  @click="toggleActive(item,i)" v-for="(v,i) in item.rule" :key="i">{{v.title}}</div>
                </div>
            </div>

            <div class="addCount">
                <div class="addCount-text">选择数量</div>
                <van-stepper v-model="value" theme="round" button-size="20"/>
            </div>

            <!-- 商品描述 -->
            <div class="desc">
                <div class="desc-title">商品描述</div>
                <p v-for="(item,index) in DetailData.desc" :key="index">{{index+1}}、{{item}}</p>
            </div>

            

            <div class="goodsAction">
                <div class="price ">￥{{DetailData.price}}</div>
                <button class="join-bag" @click="addShopBag(false)">加入购物袋</button>
                <div class="buy" @click="buy(true)">
                    <van-button type="primary" >立即购买</van-button>
                </div>
                <van-icon name="bag" size="30px" color="#999999" :badge="bagCount == 0 ? '' : bagCount" @click="goShopBag"/>
            </div>
        </div>

    </div>
</template>

<script>
import "../assets/less/detail.less"
    export default {
        name: "Detail",
        data() {
            return {
                // 商品pid
                pid: "",
                //获取到的数据
                DetailData:{},
                value:1,
                //是否收藏
                isLike:false,
                //购物袋数量
                bagCount:0,

                product: {
                    count: 1
                },
            }
        },
        created(){
            //截取pid
            this.pid = this.$route.params.pid;
            this.getDetailData();
            this.findLike();
            this.shopBagCount()
        },
        methods:{
            //获取数据
            getDetailData(){
                this.axios({
                    method:"GET",
                    url:"/productDetail",
                    params:{
                        pid:this.pid,
                        appkey:this.appkey
                    }
                }).then(result => {
                    if(result.data.code == 600){
                        let data = result.data.result[0];
                        data.desc = data.desc.split(/\n/);
                        
                        //创建一个空数组 用来收集规格
                        let rules = [];
                        let rulesData = ["tem","sugar","milk","cream"];
                        rulesData.map(v => {
                            //创造一个对象改变数据格式
                            let r = {};
                            r.title = data[v + "_desc"];
                            //获取每一项规格
                            r.rule = [];
                            //设置激活下标
                            r.ruleIndex = 0;

                            //获取规格字符串
                            let ruleString = data[v].split("/");
                            ruleString.map(index => {
                                if(index != ""){
                                    r.rule.push({title:index})
                                }
                            });

                            if(r.rule.length > 0){
                                rules.push(r)
                            }
                            
                        });
                        data.rules = rules;
                        this.DetailData = data
                        
                    }
                })
            },
            //返回
            goBack(){
                this.$router.go(-1)
            },
            // 切换标签
            toggleActive(item,i){
                
               if(item.ruleIndex == i){
                   return;
               }
               item.ruleIndex = i
            },
            // 收藏商品
            likeProduct(){
                let tokenString = localStorage.getItem("__tk");
                if(!tokenString){
                    this.$toast("请先登录")
                    return this.$router.push({name:"Login"})
                }
                let url = this.isLike ? "/notlike" : "./like"
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });
                this.axios({
                    method:"POST",
                    url,
                    data:{
                        appkey:this.appkey,
                        pid: this.pid,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 800){
                        this.isLike = true;
                        this.$toast(result.data.msg)
                    }else if(result.data.code == 900){
                        this.isLike = false
                        this.$toast(result.data.msg)
                    }

                }).catch(err => {
                  this.$toast.clear();
                })
            },
            //查看用户是否已经收藏
            findLike(){
                let tokenString = localStorage.getItem("__tk");
                if(!tokenString){
                    return;
                }
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });
                this.axios({
                    method:"GET",
                    url:"/findlike",
                    params:{
                        appkey: this.appkey,
                        pid: this.pid,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 1000){
                        if(result.data.result.length > 0){
                            this.isLike = true;
                            
                        }
                    }
                }).catch(err => {
                    this.$toast.clear();
                })
                
            },
            //加入购物车
            addShopBag(isBuy){
               
                //  检测是否登录，如果没登录跳转到登录界面
                let tokenString = localStorage.getItem("__tk");
                if(!tokenString){
                    this.$toast("请先登录")
                    return this.$router.push({name:"Login"});
                }
                let data = {
                    tokenString,
                    appkey: this.appkey,
                    count: this.product.count,
                    pid: this.pid
                }
                let r = [];
                this.DetailData.rules.map(v => {
                    r.push(v.rule[v.ruleIndex].title)
                    data.rule = r.join("/")
                })

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0
                });
                this.axios({
                    method:"POST",
                    url:"/addShopcart",
                    data,
                }).then(result => {
                    this.$toast.clear();
                    //如果token 检验无效则跳转到登录页面
                    if(result.data.code == 700){
                        this.$toast("请先登录")
                        return this.$router.push({name:"Login"});
                    }else if(result.data.code ==3000){
                        if(!isBuy){
                          if (result.data.status == 1) {
                            this.bagCount++;
                          }
                        }else{
                          //立即购买
                          this.$router.push({name: 'Pay', query: {sids: result.data.sid}});
                        }
                         this.$toast(result.data.msg)
                        
                    }
                }).catch(err => {
                    this.$toast.clear();
                })
            },
            //查询购物袋数量
            shopBagCount(){
                let tokenString = localStorage.getItem("__tk");
                if(!tokenString){
                    return;
                }
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0
                });
                this.axios({
                    method:"GET",
                    url:"/shopcartRows",
                    params:{
                        appkey : this.appkey,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 8000){
                        this.bagCount = result.data.result
                    }
                }).catch(err => {
                    this.$toast.clear();
                })
            },
            goShopBag(){
                this.$router.push({name:"Shopbag"})
                
            },
            buy(isBuy) {
              this.addShopBag(isBuy);
            }

        }
    }
</script>

<style lang="less" scoped>


</style>