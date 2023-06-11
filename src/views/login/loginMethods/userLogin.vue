<template>
  <van-form ref="form" class="form">
    <van-field
      v-model="loginForm.UserName"
      label-width="40px"
      name="UserName"
      label="用户名"
      :rules="[{ required: true, message: '请填写用户名' }]"
    />
    <van-field
      v-model="loginForm.Password"
      label-width="40px"
      type="password"
      name="Password"
      label="密码"
      :rules="[{ required: true, message: '请填写密码' }]"
    />
    <div class="valid">
      <van-field
        label-width="40px"
        name="validNumber"
        v-model="loginForm.validNumber"
        label="验证码"
        :rules="[{ required: true, message: '请填写验证码' }]"
        :maxlength="4"
      />
      <valid ref="valid"></valid>
    </div>
    <div style="margin: 16px">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="login"
      >
        登录
      </van-button>
    </div>
    <div class="btn-list">
      <span>忘记密码</span>
      <span>账号密码注册 </span>
    </div>
  </van-form>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from "vue";
import valid from "@/components/valid.vue";
import service from "@/service/login";
import Storage from "@/util/storage";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Toast } from "vant";
export default defineComponent({
  components: { valid },
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref();
    const valid = ref();
    let loginForm = reactive<IloginForm>({
      UserName: "",
      Password: "",
      validNumber: "",
    });
    const login = async (): Promise<void> => {
      const response: ICallBack = (errStatus: boolean, res: any) => {
        if (!errStatus) {
          Storage.set("token", "Bearer " + res?.LoginResponse?.token);
          router.push("/");
          store.commit("setLoginStatus", true);
        } else {
          loginForm.validNumber = "";
          valid.value.reset();
        }
      };
      try {
        await form.value.validate(["UserName", "Password", "validNumber"]);
        const validNum = valid.value.code === loginForm.validNumber;
        console.log(valid.value.code, loginForm.validNumber);
        if (validNum) {
          service.goLogin(toRaw(loginForm), response);
        } else {
          Toast.fail("验证码验证失败");
          loginForm.validNumber = "";
          valid.value.reset();
        }
      } catch (error) {}
    };

    // const RegisterForm = reactive<IRegister>({
    //   UserName: "",
    //   Password: "",
    // });
    // const register = (): void => {
    //   const response: ICallBack = (errStatus: boolean, res: any) => {
    //     if (!errStatus) {
    //       loginForm = Object.assign(toRaw(RegisterForm), toRaw(RegisterForm));
    //       login();
    //     }
    //   };
    //   service.goRegister(toRaw(RegisterForm), response);
    // };
    return {
      // showStatus,

      // RegisterForm,
      // changeStatus,
      form,
      valid,
      loginForm,
      login,
      // register,
    };
  },
});
</script>
<style lang="less" scoped>
.form {
  height: 50vh;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  align-items: center;
  .valid {
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      width: 70px;
      font-size: 14px;
      padding-left: 10px;
      line-height: 10vh;
    }
    /deep/ .van-cell.van-field {
      height: 30px;
      transform: translateY(15px);
    }
  }
  .btn-list {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    span {
      font-size: 15px;
    }
  }
}
</style>
