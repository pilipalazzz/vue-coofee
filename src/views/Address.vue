<template>
    <div class="address">
        <div class="navBar">
            <van-nav-bar
                title="地址管理"
                left-text="返回"
                left-arrow
                @click-left="goBack"
            />
        </div>
        <div class="bg">
            <div class="address-box">
                <div class="bgc">
                    <van-address-list
                        v-model="chosenAddressId"
                        :list="list"
                        default-tag-text="默认"
                        @add="toNewAddress"
                        @edit="edit"
                    />
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        name:"Address",
        data(){
            return {
                chosenAddressId: '1',
                list: [],
            }
        },
        created(){
            this.getAddress();
        },
        methods:{
            goBack(){
                this.$router.go(-1)
            },
            toNewAddress(){
                this.$router.push({name:"NewAddress"})
            },
            getAddress(){
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
            //编辑地址
            edit(item){
                this.$router.push({name:"NewAddress",query:{aid : item.aid}})
            }
            
        }

    }
</script>

<style lang="less" scoped>
    .address{
        background-color: #f5f5f5;
        width: 100%;
        height: 100%;
        position: absolute;
        .navBar{
            /deep/.van-icon{
                color: #0c34ba;
            }
            /deep/.van-nav-bar__text{
                color: #0c34ba;
            }
        }
        .bg{
            height: 100px;
            background-color:#0c34ba;
            position: relative;
            .address-box{
                position: absolute;
                left: 0;
                top: 69px;
                padding: 0 10px;
                width: 100%;
                
                .bgc{
                    width: 100%;
                    background-color: #fff;
                    padding:0 10px 10px ;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    .van-address-list{
                        padding: 0;
                    }
                    .van-tag--danger{
                        background-color: #0c34ba;
                    }
                    .van-address-item{
                        border-bottom: 1px solid #cccccc;
                    }
                    .van-address-item:not(:last-child){
                        margin-bottom: 2px;
                    }
                    /deep/.van-radio__icon--checked .van-icon{
                        background-color:  #0c34ba;
                        border-color: #0c34ba;
                    }
                    .van-button--danger{
                        background-color: #0c34ba;
                        border-color:#0c34ba;
                    }
                }
                
            }
        }
    }
</style>