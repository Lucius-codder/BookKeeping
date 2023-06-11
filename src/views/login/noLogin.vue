<template>
  <div class="form-body">
    <img class="logo-image" src="@/assets/logo.gif" />
    <div class="account-container">
      <van-button
        icon="friends-o"
        type="primary"
        class="btn"
        plain
        hairline
        @click="loginFactory('user')"
      >
        用户名密码登录
      </van-button>
      <template v-for="btn in thirdPartBtns" :key="btn.name">
        <van-icon name="chat-o" class="circleBtn" size="30" />
      </template>
      <div class="lincense">已阅读</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const thirdPartBtns = [
      {
        name: "wechat",
        icon: "",
      },
      {
        name: "none",
        icon: "",
      },
      {
        name: "qq",
        icon: "",
      },
    ];
    0;
    type ILoginType = "user";
    const loginFactory = (type: ILoginType) => {
      router.push("/login/byUser");
    };
    return {
      thirdPartBtns,
      loginFactory,
    };
  },
});
</script>
<style lang="less" scoped>
@logo-size: 50vh;
@btnColor: #fff;
@btnBorderColor: rgb(44 82 116);
.form-body {
  height: 95vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: @logo-size 1fr;
  justify-content: flex-start;
  .logo-image {
    display: inline-block;
    height: @logo-size;
    width: 100vw;
    // padding: 0 calc((100vw - @logo-size) / 2);
  }
  .account-container {
    height: 100%;
    padding: 0 20px;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    grid-template-areas:
      "a a a"
      ". . ."
      "e e e";
    .btn {
      grid-area: a;
    }
    .circleBtn {
      border-radius: 50%;
      height: 50px;
      width: 50px;
      left: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateX(-50%);
      border: 1px solid @btnBorderColor;
      color: @btnBorderColor;
    }
    .lincense {
      grid-area: e;
    }
  }
}
</style>
