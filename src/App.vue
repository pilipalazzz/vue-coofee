<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix::after{
  content: "";
  clear: both;
  display: block;
  height: 0;
  line-height: 0;
  visibility: hidden;
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.auto-img{
  width: 100%;
  display: block;
}

</style>
