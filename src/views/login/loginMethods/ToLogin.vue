<template>
  <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />
  <router-view></router-view>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const onClickLeft = () => {
      router.push("/");
      store.commit("setTabActive", "mine");
    };
    return {
      onClickLeft,
    };
  },
});
</script>
<style lang="less" scoped></style>
