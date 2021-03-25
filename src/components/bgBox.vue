<template>
    <div class="bg-box">
        <div class="bg">
            <div class="bg-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:"bgBox"
    }
</script>

<style lang="less" scoped>
    .bg-box{
        .bg{
            position: relative;
            height: 100px;
            background-color: #0c34ba;
            .bg-content{
                overflow: hidden;
                background-color: transparent;
                width: 95%;
                border-radius: 10px;
                position: absolute;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
</style>