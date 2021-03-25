<template>
    <div class="orderItem">
        <div class="proInfo">
            <div class="proInfo-left">
                <img class="auto-img" :src="item.smallImg">
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
    </div>
</template>

<script>
    export default {
        name:"orderItem",
        props:{
            item:{
                type : Object,
                default(){
                    return {
                        
                    };
                },
                
            }
        }
    }
</script>

<style lang="less" scoped>
    .orderItem{
        .proInfo{
                display: flex;
                padding: 10px;
                .proInfo-left{
                    flex: 20%;
                    height:70px;
                    display: flex;
                    align-items: center;
                }
                .proInfo-right{
                    flex: 80%;
                    padding:0 10px;
                    .proInfo-title{
                        font-size: 16px;
                        .pro-rule{
                            font-size: 14px;
                            color: #999999;
                            margin-left: 20px;
                        }
                    }
                    .enname{
                        margin-top: 5px;
                        color: #999999;
                    }
                    .priceAndCount{
                        margin-top: 10px;
                        font-size: 14px;
                        .price{
                            font-weight: bold;
                            color: #0c34ba;
                        }
                        .count{
                            color: #999999;
                        }
                    }
                }
            }
    }
</style>