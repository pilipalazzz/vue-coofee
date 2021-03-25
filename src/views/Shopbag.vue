<template>
    <div class="shopbag">
        <van-nav-bar
        title="购物袋"
        left-text="返回"
        left-arrow
        @click-left="goBack"
        @click-right="isEdit = !isEdit"
        >
            <template #right>
                <div v-if="allShopbagData.length > 0" :class="isEdit ? 'edit' : ''">{{isEdit ? "完成" : "编辑"}}</div>
            </template>
        </van-nav-bar>

        <div class="list-box">
            <div v-if="allShopbagData.length == 0">
                <van-empty description="购物袋空空如也" >
                    <div class="gyg">
                        <van-button color="#0c34ba" round @click="goHome">去逛一逛</van-button>
                    </div>
                </van-empty>
            </div>
            
            <div class="list-item-box" v-for="(item,index) in allShopbagData" :key="item.sid">
                <van-swipe-cell :disabled="!isEdit">
                    <div class="list-item">
                        <div class="list-item-left">
                            <van-checkbox 
                            v-model="item.isChecked" 
                            checked-color="#0C34BA"
                            @click="radio"
                            />
                        </div>
                        <div class="list-item-right">
                            <div class="img-box"  @click="goDetail(item.pid)">
                                <img :src="item.small_img">
                            </div>
                            <div class="content">
                                <div class="title">
                                    <span class="name">{{item.name}}</span>
                                    <span class="desc">{{item.rule}}</span>
                                </div>
                                <div class="enname">{{item.enname}}</div>
                                <div class="countAndPrice clearfix">
                                    <div class="price fl">￥{{item.price}}</div>
                                    <div class="count fr">
                                        <van-stepper 
                                        v-model="item.count" 
                                        theme="round" 
                                        button-size="20"
                                        @change="changeCount(item)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </div>
                    <template #right>
                        <van-button 
                        square  
                        text="删除" 
                        color="#0c34ba"
                        @click="removeOne(index, item.sid)"
                        />
                    </template>
                </van-swipe-cell>
            </div>
            <!-- 提交 -->
            <van-submit-bar 
            v-if="!isEdit && allShopbagData.length != 0"
            :price="total" 
            button-text="提交订单" 
            button-color="#0c34ba"
            @submit="commit"
            >
                <van-checkbox v-model="isAllChecked" @click="allChecked">全选</van-checkbox>
            </van-submit-bar>
            
            <!-- 删除 -->
            <div class="del" v-else-if="allShopbagData.length != 0">
                <van-submit-bar
                button-text="删除选择"
                button-color="#0c34ba"
                @submit="removeSelected"
                >
                <van-checkbox v-model="isAllChecked">
                全选
                </van-checkbox>
            </van-submit-bar>
            </div>

        </div>
        
    </div>
    
</template>

<script>
    import ("../assets/less/shopbag.less")
    export default {
        name:"Shopbag",
        data(){
            return {
                //是否处于编辑状态
                isEdit : false,
                //是否选中
                isChecked:false,
                isAllChecked:false,
                allShopbagData:{},
                total:0
            }
        },
        created(){
            this.getShopBag();
        },
        methods:{
            //获取全部购物袋数据
            getShopBag(){
                let tokenString = localStorage.getItem("__tk");
                if(!tokenString){
                    return this.$router.push({name:"Login"});
                }
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0
                });
                this.axios({
                    method:"GET",
                    url:"/findAllShopcart",
                    params:{
                        appkey: this.appkey,
                        tokenString,
                    }
                }).then((result) => {
                    this.$toast.clear();
                    if(result.data.code == 700){
                        this.$router.push({name:"Login"})
                    }else if(result.data.code == 5000){
                        result.data.result.map(v => {
                            v.isChecked = false;
                        })
                        this.allShopbagData = result.data.result
                    }
                })
            },
            goHome(){
                this.$router.push("Home")
            },
            //返回上一级
            goBack(){
                this.$router.go(-1)
            },
            //全选
            allChecked(){
                this.allShopbagData.map(v => {
                    v.isChecked = this.isAllChecked;
                })
                this.sum();
            },
            //单选
            radio(){
                this.sum();
                for(let i = 0; i < this.allShopbagData.length; i++){
                    if(!this.allShopbagData[i].isChecked){
                        this.isAllChecked = false;
                        return;
                    }
                }
                this.isAllChecked = true;
            },
            //删除单个
            removeOne(index,sid){
                //获取token
                let tokenString = localStorage.getItem("__tk");
                // 
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
                    url:"/deleteShopcart",
                    data:{
                        appkey: this.appkey,
                        tokenString,
                        sids: JSON.stringify([sid])
                    }
                }).then(result => {
                    this.$toast.clear();
                    // 
                    //token检测无效，跳转到登录界面
                    if(result.data.code == 700){
                        this.$toast("请先登录")
                        return this.$router.push({ name: "Login" });
                    }else if(result.data.code == 7000){
                        this.$toast(result.data.msg)
                        //删除成功移出页面的商品
                        this.allShopbagData.splice(index, 1);
                        this.sum();
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            //判断是否勾选
            isSelect(){
                for(let i = 0; i < this.allShopbagData.length; i++){
                    if(this.allShopbagData[i].isChecked){
                        return true;
                    }
                }
                return false;
            },
            //删除选中
            removeSelected(){
                let isHas = this.isSelect();
                
                if(!isHas){
                    this.$toast("请选择要删除的商品");
                    return false;
                }
                //勾选的物品sid合集
                let sids = [];
                this.allShopbagData.map(v => {
                    if(v.isChecked){
                        sids.push(v.sid)
                    }
                })

                //获取token
                let tokenString = localStorage.getItem("__tk");
                // 
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
                    method: "POST",
                    url: "/deleteShopcart",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sids: JSON.stringify(sids)
                    },
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 700){
                        this.$toast("请先登录")
                        this.$router.push({ name: "Login" });
                    }else if(result.data.code == 7000){
                        for(let i = 0; i < this.allShopbagData.length; i++){
                            if(this.allShopbagData[i].isChecked){
                                this.allShopbagData.splice(i,1);
                                i--;
                            }
                        }
                        this.$toast(result.data.msg)
                    }
                    this.sum();
                }).catch(err => {
                    
                })
            },
            //修改购物车数量
            changeCount(item){

                //获取token
                let tokenString = localStorage.getItem("__tk");
                // 
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
                    url:"/modifyShopcartCount",
                    data:{
                        appkey: this.appkey,
                        tokenString,
                        sid: item.sid,
                        count: item.count
                    }
                }).then(result => {
                    this.$toast.clear();
                    // 
                    if (result.data.code == 700) {
                        //token检验无效,则跳到登录页面
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 6000) {
                        if (item.isChecked) {
                        this.sum();
                        }
                    } else {
                        this.$toast(result.data.msg);
                    }
                }).catch((err) => {
                    this.$toast.clear();
                    
                });
            },
            //计算订单总金额
            sum(){
                this.total = 0;
                this.allShopbagData.map(v => {
                    if(v.isChecked){
                        this.total += v.count * v.price
                    }
                })
                this.total *= 100
            },
            //提交订单
            commit(){
                let isHas = this.isSelect();
                if(!isHas){
                    this.$toast("请选择要购买的商品")
                    return;
                }
                let sids = [];

                this.allShopbagData.map(v => {
                    if(v.isChecked){
                        sids.push(v.sid)
                    }
                })
                this.$router.push({name: 'Pay', query: {sids: sids.join('-')}});
                
            },
            goDetail(pid){
              this.$router.push({name:"Detail",params:{pid}})
            }
        }
    }
</script>

<style lang="less" scoped>

</style>