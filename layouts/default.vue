<template>
  <div class="brokerage-application">
    <header class="application-header">
      <div class="logo">
        <img src="../assets/images/logo-white.png" class="img" />
      </div>
      <div class="title">[個人] 月極駐車場お申込みフォーム</div>
    </header>
    <div class="application-main">
      <nuxt />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.application-header {
  display: flex;
  align-items: center;
  background-color: #00acbf;
  padding: 8px 10px;
  color: #fff;
  line-height: 1.8;
  > .logo {
    display: inline-flex;
    align-items: center;
    margin: 0;
    width: 70px;
  }
  > .logo > .img {
    width: 100%;
  }
  > .title {
    display: block;
    margin-left: auto;
    font-size: 0.9rem;
    font-weight: bold;
  }
}
</style>
