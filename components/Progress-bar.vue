<template>
  <div class="progress-bar">
    <div class="bar"></div>
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 5px;
  > .bar {
    position: relative;
    height: 20px;
    background: #00acbf;
    border-radius: 5px 0 0 5px;
    &::after {
      content: '';
      position: absolute;
      top: -12px;
      right: -8px;
      border-top: 8px solid #333;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
    }
  }
}
</style>
