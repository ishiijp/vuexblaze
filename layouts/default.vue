<template>
  <div class="brokerage-application">
    <header class="application-header">
      <div class="logo">
        <img src="../assets/images/logo-white.png" class="img" />
      </div>
      <div class="title">月極駐車場お申込みフォーム [個人]</div>
      <div class="contacts">
        <div class="title">担当者に連絡</div>
        <div class="contact">
          <a href="" class="btn -tel">
            <img
              src="data:image/svg+xml;base64,PHN2ZyBpZD0iNGI5MTkxZGItMDliMS00MDFkLWIwOTMtOTA4ZDJjY2RjNWYwIiBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+PHBhdGggZD0iTTUwLDBhNTAsNTAsMCwxLDAsNTAsNTBBNTAsNTAsMCwwLDAsNTAsMFptMCw5NkE0Niw0NiwwLDEsMSw5Niw1MCw0Niw0NiwwLDAsMSw1MCw5NloiIHN0eWxlPSJmaWxsOiNmZmYiLz48cGF0aCBkPSJNNjMuNSw1OWMtMS43LS42LTQsLjktNC43LDIuOVM1Nyw2My42LDU3LDYzLjZzLTQtMS44LTExLTEwLjEtOC4xLTEyLjQtOC4xLTEyLjRTMzcuOCw0MCw0MCwzOS42czMuOS0yLjQsMy43LTQuMUE1My40LDUzLjQsMCwwLDAsMzguOSwyNGMtMS42LTIuNC01LjEtMS41LTYtMXMtOS4zLDQuOS03LjcsMTQuNkE1MC40LDUwLjQsMCwwLDAsMzYuNiw2MS41LDQ5LjksNDkuOSwwLDAsMCw1OC4yLDc2LjhjOS4zLDMuMiwxNS4xLTQuNCwxNS43LTUuMnMyLjEtNC4xLDAtNi4xQTU0LjMsNTQuMywwLDAsMCw2My41LDU5WiIgc3R5bGU9ImZpbGw6I2ZmZiIvPjwvc3ZnPg=="
              class="img"
            />
          </a>
          <a href="" class="btn -mail"
            ><img
              src="data:image/svg+xml;base64,PHN2ZyBpZD0iNzVmYTgwMmQtY2RkZC00NTNkLWJiMjMtOThjNTAzOWM1YmNmIiBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+PHBhdGggZD0iTTUwLDBhNTAsNTAsMCwxLDAsNTAsNTBBNTAsNTAsMCwwLDAsNTAsMFptMCw5NkE0Niw0NiwwLDEsMSw5Niw1MCw0Niw0NiwwLDAsMSw1MCw5NloiIHN0eWxlPSJmaWxsOiNmZmYiLz48cGF0aCBkPSJNNjkuNSwyN2gtMzlBMTEuNiwxMS42LDAsMCwwLDE5LDM4LjV2MjNBMTEuNiwxMS42LDAsMCwwLDMwLjUsNzNoMzlBMTEuNiwxMS42LDAsMCwwLDgxLDYxLjV2LTIzQTExLjYsMTEuNiwwLDAsMCw2OS41LDI3Wm0tMzksNkg3MC42bC0xNy4xLDE5YTQuNiw0LjYsMCwwLDEtNywwbC0xNy4xLTE5Wk03NSw2MS41QTUuNSw1LjUsMCwwLDEsNjkuNSw2N2gtMzlBNS41LDUuNSwwLDAsMSwyNSw2MS41di0yM2E0LjksNC45LDAsMCwxLC4xLTEuMmwxNywxOC44YTEwLjUsMTAuNSwwLDAsMCwxNS44LDBsMTctMTguOGE0LjksNC45LDAsMCwxLC4xLDEuMloiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4="
              class="img"
          /></a>
        </div>
      </div>
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
    margin: 0 16px;
    // margin-left: auto;
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 1.4;
  }
  > .contacts {
    margin-left: auto;
    // margin-left: 0;
  }
  > .contacts > .title {
    width: 100%;
    margin: 0 auto 2px;
    text-align: center;
    font-size: 0.7em;
    font-weight: bold;
    color: #fff;
  }
  > .contacts > .contact {
    display: flex;
    align-items: center;
  }
  > .contacts > .contact > .btn {
    width: 34px;
    margin: 0 4px;
  }
}
</style>
