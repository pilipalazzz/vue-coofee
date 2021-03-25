<template>
    <div class="order">
        <van-nav-bar
            title="我的订单"
            left-text="返回"
            @click-left="goBack"
            left-arrow
            />
        <bg-box>
            <div v-if="isHas">
                <van-tabs v-model="tabIndex" @change="changeTab">
                    <van-tab title="全部">
                        <orderList 
                        :isRight="true" 
                        v-for="(item,index) in orderDatas"
                        :key="item.oid"
                        :count="item.count"
                        :total="item.total"
                        :num="item.oid"
                        :is-receive=" item.status == 2 "
                        @receive="confirmReceive(item,index)"
                        @remove="removeOrder(item.oid,index)"
                        >
                            <template>
                                <orderItem 
                                v-for="(v,k) in item.data" 
                                :key="k" 
                                :item="v"
                                
                                ></orderItem>
                            </template>
                        </orderList>
                    </van-tab>

                    <van-tab title="进行中">
                        <orderList
                        :isRight="true" 
                        v-for="(item,index) in inProgressData"
                        :key="index"
                        :count="item.count"
                        :total="item.total"
                        :num="item.oid"
                        :is-receive=" item.status == 2 "
                        @receive="confirmReceive(item,index)"
                        @remove="removeOrder(item.oid,index)">
                          <orderItem 
                          v-for="(v,x) in item.data" 
                          :key="x" 
                          :item="v"
                          ></orderItem>
                        </orderList>
                    </van-tab>

                    <van-tab title="已完成">
                      <orderList
                        :isRight="true" 
                        v-for="(item,index) in finishedData"
                        :key="index"
                        :count="item.count"
                        :total="item.total"
                        :num="item.oid"
                        :is-receive=" item.status == 2 "
                        @receive="confirmReceive(item,index)"
                        @remove="removeOrder(item.oid,index)">
                          <orderItem 
                          v-for="(v,x) in item.data" 
                          :key="x" 
                          :item="v"
                          ></orderItem>
                        </orderList>
                    </van-tab>
                </van-tabs>
            </div>
            <div v-else>
                <van-empty description="没有订单" />
            </div>
        </bg-box>
        
    </div>
</template>

<script>
    import ("../assets/less/order.less")
    import bgBox from "../components/bgBox.vue"
    import orderList from "../components/orderList.vue"
    import orderItem from "../components/orderItem.vue"
    export default {
        name:"Order",
        data(){
            return {
                //默认激活下标
                tabIndex:0,
                //是否有订单数据
                isHas:true,
                // 订单数据
                orderDatas:[],       
                //正在进行中数据
                inProgressData:[],
                // 已完成
                finishedData:[]
                   
                
            }
        },
        created(){
            this.getOrderDataByStatus()
        },
        methods:{
            //改变状态
            changeTab(name,title){
                this.dataProcessing()
            },
            //获取订单数据
            getOrderDataByStatus(){
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
                    url:"/findOrder",
                    params:{
                        appkey: this.appkey,
                        tokenString,
                        status: this.tabIndex
                    }
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 700){
                        this.$router.push({ name: "Login" });
                    }else if(result.data.code == 70000){
                        if(this.tabIndex == 0 && result.data.result.length == 0){
                            this.isHas = false;
                            return;
                        }

                        let orderDatas = [];
                        result.data.result.map(v => {
                           
                            for (let i = 0; i < orderDatas.length; i++){
                                    if(orderDatas[i].oid == v.oid){
                                        orderDatas[i].data.push(v)
                                        orderDatas[i].count += v.count
                                        orderDatas[i].total += v.count * v.price
                                        return;
                                    }
                            }

                           let o = {};
                           o.oid = v.oid
                           o.count = v.count
                           o.status = v.status
                           o.total = v.count * v.price
                           //时间
                           o.date = v.createdAt
                           // o.data == 每一项大数据中的小数据
                           o.data = [v]
                           orderDatas.push(o)
                        })
                        this.orderDatas = orderDatas
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            //确认收货
            confirmReceive(item,index){
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
                    method: "POST",
                    url: "/receive",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        oid: item.oid
                    },
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 700){
                        this.$router.push({ name: "Login" });
                    }else if(result.data.code == 80000){
                        //如果是在进行中点击确认收货后 将会从进行中列表删除
                        if(this.tabIndex == 1){
                            this.inProgressData.splice(index,1)
                        }
                       item.status = 2;
                    }
                     this.$toast(result.data.msg)
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            //删除
            removeOrder(oid,index){
                //检测token 如果没有登录 则跳转到登录界面
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
                    method: "POST",
                    url: "/removeOrder",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        oid
                    },
                }).then(result => {
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    }else if(result.data.code == 90000){
                        this.$toast(result.data.msg)
                        this.orderDatas.splice(index,1);
                        this.finishedData.splice(index,1)
                    }
                })
            },
            goBack(){
                this.$router.go(-1);
            },
            //正在进行中数据
            dataProcessing(){
              this.finishedData = [];
              this.inProgressData = [];
              this.orderDatas.map(v => {
                if(v.status == 1){
                  this.inProgressData.push(v)
                }else if(v.status == 2){
                  this.finishedData.push(v)
                }
              })
            }

        },
        components:{
            bgBox,
            orderList,
            orderItem
        }
    }
</script>

<style lang="less" scoped>
        /deep/.van-icon{
            color: #0c34ba;
        }
        /deep/.van-nav-bar__text{
            color: #0c34ba;
        }
</style>