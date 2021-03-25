<template>
    <div class="main">
        <!-- 二级路由 -->
        <router-view></router-view>
        <van-tabbar v-model="activeName" inactive-color="#a5a5a5" active-color="#285cc9" route>
            <van-tabbar-item replace :to="item.path" v-for="(item,index) in tabbarData" :key="index">
                <span>{{item.title}}</span>
                <template #icon="props">
                <img :src="props.active ? item.activeImg  : item.inactiveImg" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    export default {
        name:"Main",
        data() {
            return {
                activeName:"Home",
                tabbarData:[
                    {
                        title:"首页",
                        name:"Home",
                        path:"/home",
                        activeImg:require("../assets/image/-xiaolu.png"),
                        inactiveImg:require("../assets/image/xiaolu.png"),
                    },
                    {
                        title:"菜单",
                        name:"Menu",
                        path:"/menu",
                        activeImg:require("../assets/image/-kafei.png"),
                        inactiveImg:require("../assets/image/kafei.png"),
                    },
                    {
                        title:"购物袋",
                        name:"Shopbag",
                        path:"/shopbag",
                        activeImg:require("../assets/image/-bag.png"),
                        inactiveImg:require("../assets/image/bag.png"),
                    },
                    {
                        title:"我的",
                        name:"My",
                        path:"/my",
                        activeImg:require("../assets/image/-wode.png"),
                        inactiveImg:require("../assets/image/wode.png"),
                    },
                ]
            }
        }
    }
</script>

<style lang="less" scoped>

</style>