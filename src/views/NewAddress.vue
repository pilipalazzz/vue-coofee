<template>
    <div class="newAddress">
        <div class="navBar">
            <van-nav-bar
                title="新增地址"
                left-text="返回"
                left-arrow
                @click-left="goBack"
            />
        </div>

        <van-address-edit
        :area-list="areaList"
        show-postal
        show-delete
        show-set-default
        show-search-result
        save-button-text="保存地址"
        :address-info="addressInfo"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @delete="removeAddress"
        @save="save"
        />
    </div>
</template>

<script>
    import areaList from "../assets/js/area.js"
    import ("../assets/less/newAddress.less")
    export default {
        name:"NewAddress",
        data(){
            return{
               areaList,
               aid:'',
               addressInfo:{}
            }
        },
        created(){
            // 截取aid
            this.aid = this.$route.query.aid;
            // 如果有aid
            if(this.aid){
                this.getAidPro()
            }
        },
        methods:{
            goBack(){
                this.$router.go(-1);
            },
            save(content){
                //获取token
                let tokenString = localStorage.getItem("__tk");
                if (!tokenString) {
                    //跳回登录页面
                    this.$toast("请先登录");
                    return this.$router.push({ name: "Login" });
                }

                let addressInfo = Object.assign({},content)
                //删除country
                delete addressInfo.country;
                addressInfo.tokenString = tokenString;
                addressInfo.appkey = this.appkey;
                addressInfo.isDefault = Number(addressInfo.isDefault);

                if(!this.aid){
                    this.address(addressInfo,"/addAddress")
                }else{
                    // 是否编辑
                    let isModify = false;
                    for(let key in this.addressInfo){
                        if(content[key] != this.addressInfo[key]){
                            
                            isModify = true;
                        }
                    }
                    if(isModify){
                        this.address(addressInfo,"/editAddress")
                    }else{
                        return this.$toast("请修改地址信息")
                    }
                }

               
            },
            address(addressInfo,url){

                this.axios({
                    method:"POST",
                    url,
                    data : addressInfo
                }).then(result => {

                    if(result.data.code == 700) {
                        //token检验无效,则跳到登录页面
                        this.$router.push({ name: "Login" });
                    }else if(result.data.code == 9000 || result.data.code == 30000){
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 800)
                        this.$toast(result.data.msg);
                    } 
                }).catch((err) => {
                    this.$toast.clear();
                    
                });
            },
            //通过商品aid查询商品
            getAidPro(){
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
                duration: 0
                });

                this.axios({
                    method:"GET",
                    url:"/findAddressByAid",
                    params:{
                        appkey: this.appkey,
                        tokenString,
                        aid: this.aid
                    }
                }).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 700){
                        this.$router.push({ name: "Login" });
                    }else if(result.data.code == 40000){
                        let data = result.data.result[0];
                        data.isDefault = Boolean(data.isDefault);
                        this.addressInfo = data
                    }
                }).catch(err => {
                    
                })
            },
            removeAddress(){
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
                    url: "/deleteAddress",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        aid: this.aid
                    }
                }).then(result => {
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        //token检验无效,则跳到登录页面
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 10000) {
                        setTimeout(() => {
                        this.$router.push({name: 'Address'});
                        }, 800)
                    }

                    this.$toast(result.data.msg);
                }).catch(err => {
                    this.$toast.clear();
                    
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