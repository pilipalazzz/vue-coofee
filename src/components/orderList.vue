<template>
    <div class="orderList">
        <!-- 头部 -->
        <div class="order-tit clearfix">
            <div class="No fl">{{num}}</div>
            <div class="orderDel fr" v-if="isRight">
                <div v-if="!isReceive" @click="receive">确认收货</div>
                <div class="right" v-else>
                    <div class="order-del" @click="remove"></div>
                    <div class="order-finish">已完成</div>
                </div>
            </div>
        </div>
        <!-- 中间内容 -->
        <div class="order-content">
            <slot></slot>
        </div>
        <!-- 尾部内容 -->
        <div class="footer">
            <div class="time">{{time}}</div>
            <div class="totalBox clearfix">
                <div class="count fl">共计 {{count}} 件商品</div>
                <div class="total fr">合计 ￥{{total}}</div>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        name:"orderList",
        props:{
            // 数量
            count:{
                type:Number,
                default:0
            },
            // 总计
            total:{
                type:[Number,String],
                default:0
            },
            // 订单编号
            num:{
                type:String,
                default:"订单编号"
            },
            // 时间
            time:{
                type:String,
                default:"2020-11-03 20:20:14"
            },
            //是否显示右侧删除内容
            isRight:{
                type:Boolean,
                default:true
            },
            //是否确认收货
            isReceive:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            receive(){
                this.$emit("receive")
            },
            remove(){
                this.$emit("remove")
            }
        }
    }
</script>

<style lang="less" scoped>
    .orderList{
        margin-top: 10px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        .order-tit{
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            font-size: 16px;
            color: #999999;
            background-color: #fff;
            border-bottom: 1px solid #cccccc;
            .orderDel{
                display: flex;
                flex-direction: row-reverse;
                align-items: center;
                .order-del{
                    display: flex;
                    align-items: center;
                    height: 22px;
                    width: 22px;
                    background: url("../assets/image/shanchu.png") no-repeat;
                    background-size: cover;
                    margin-left: 10px;
                }
                .right{
                    display: flex;
                    align-items: center;
                    flex-direction: row-reverse;
                }
                .order-finish{
                    color: #0c34ba;
                    font-weight: bold;
                    font-size: 14px;
                }
            }
        }
        .order-content{
            padding: 0 10px;
            border-bottom: 1px dashed #cccccc;
        }
        .footer{
            font-size: 14px;
            padding: 10px;
            .time{
                color: #999999;
                margin-bottom: 10px;
            }
            .count{
                font-weight: bold;
            }
            .total{
                color: #0c34ba;
                font-weight: bold;
            }
        }
    }
</style>