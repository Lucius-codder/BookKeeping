<template>
  <div class="code-content">
    <ul class="code-list">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div class="submit-btn" @click="action">
      <div class="btn-ball"></div>
      <div class="btn-rod"></div>
      <div class="btn-stand"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
// import anime from "anime";
export default defineComponent({
  setup() {
    let ball;
    let submit: any;
    let list: any;
    let isActive = false; //当前是否有动画
    let startY: any,
      isDown = false;
    let w = 45,
      h = 60;
    const _2REM = 48;
    let backgroundImage: any;
    let code = ref();

    onMounted(() => {
      ball = document.querySelector(".btn-ball");
      submit = document.querySelector(".submit-btn");
      list = document.querySelector(".code-list");
      backgroundImage = createBackgroundImage(w, h);
      addBackgroundImage(); //每个验证码增加图片
      bindEvent();
      if (ball) {
        ball.addEventListener("animationend", (e) => {
          submit.classList.remove("active");
          play();
        });
      }
      play();
    });

    //点击切换
    function action() {
      if (isActive) return;
      code.value = "";
      isActive = true;
      submit.classList.add("active");
    }

    function play() {
      let nums: string[] = createNums();
      code.value = nums.join("");
      [].forEach.call(list.children, (el: any, index: number) => {
        setTimeout(() => {
          const isREM = String(el.style.backgroundPositionY).indexOf("rem");
          let y = parseFloat(el.style.backgroundPositionY || "0");
          y = y * (isREM ? _2REM : 1);
          // anime({
          //   targets: el,
          //   backgroundPositionY: [
          //     `${y / _2REM}rem`,
          //     `${(10 - Number(nums[index]) * h - h / 4) / _2REM}rem`,
          //   ],
          //   loop: false, // 循环播放
          //   direction: "normal",
          //   easing: "easeOutCirc", // 时间曲线
          //   duration: 2000, // 播放时间2s
          //   autoplay: true, // 是否立即播放
          //   complete: (anim: any) => {
          //     if (index == 3) isActive = false;
          //   },
          // });
        }, index * 200);
      });
    }

    function bindEvent() {
      submit.addEventListener("touchstart", _mouseDown);
      submit.addEventListener("touchmove", _mouseMove);
      submit.addEventListener("touchend", _mouseUp);
    }

    function _mouseDown(e: any) {
      if (isActive) return;
      if (isDown) return;
      let clientY =
        e.offsetY || (e.changedTouches && e.changedTouches[0].clientY);
      startY = clientY;
      isDown = true;
    }

    function _mouseMove(e: any) {
      if (isActive) return;
      if (!isDown) return;
      let clientY =
        e.offsetY || (e.changedTouches && e.changedTouches[0].clientY);
      let d = clientY - startY;
      console.log(d);
      if (d > 3) {
        isDown = false;
        action();
      }
    }

    function _mouseUp() {
      isDown = false;
    }

    function random(min: any, max: any) {
      return parseInt(Math.random() * (max - min + 1) + min);
    }

    function createNums(l = 4): string[] {
      let num = random(1, 9999);
      let res = (num + "").split("");
      let len = res.length;
      if (len < l) {
        for (let i = 0; i < l - len; i++) {
          res.unshift("0");
        }
      }
      return res;
    }

    //生成数字图片
    function createBackgroundImage(w: number, h: number) {
      let canvas = document.createElement("canvas");
      let ctx: any = canvas.getContext("2d");
      canvas.width = ctx.width = w;
      canvas.height = ctx.height = h * 10;
      let BackgroundImage = new Array(10).fill(0);
      BackgroundImage.forEach((n, i) => {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 36px Baloo Bhaijaan";
        ctx.fillText(i, w / 2, h * i + h / 2 + 5, w);
        ctx.restore();
      });
      return convertCanvasToImage(canvas);
    }

    function convertCanvasToImage(canvas: any) {
      var image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    }

    function addBackgroundImage() {
      [].forEach.call(list.children, (el: any) => {
        el.style.backgroundImage = `url(${backgroundImage.src})`;
      });
    }

    const reset = () => {
      play();
    };
    return {
      code,
      reset,
      action,
    };
  },
});
</script>
<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css?family=Baloo+Bhaijaan&display=swap");
* {
  -webkit-tap-highlight-color: transparent !important;
}

.code-content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  width: 100%;
  box-sizing: border-box;
  ul {
    display: flex;
    align-items: center;
    li {
      width: 45px;
      height: 60px;
      position: relative;
      background-color: #ddd;
      border-radius: 3px;
      overflow: hidden;
      background-repeat: repeat-y;
      background-size: 100% auto;
      background-position-y: 0px;
      &:not(:last-of-type) {
        margin-right: 12px;
      }
    }
  }
  .submit-btn {
    width: 70px;
    height: 70px;
    margin-left: 21px;
    top: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .btn-stand {
      width: 36px;
      height: 36px;
      background: #333333;
      border-radius: 50%;
      box-shadow: 0 6px #666666;
      position: absolute;
      bottom: 0;
    }
    .btn-ball {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #e50;
      z-index: 9;
      top: 0px;
      cursor: pointer;
    }
    .btn-rod {
      z-index: 8;
      width: 5px;
      height: 36px;
      background: #e9af30;
      border-radius: 2px;
      margin-left: 1px;
      position: absolute;
      bottom: 18px;
      transform: scaleY(1);
      transform-origin: center bottom;
    }
    &.active {
      .btn-rod {
        animation: rod-down 0.32s linear;
      }
      .btn-ball {
        animation: ball-down 0.32s linear;
      }
    }
  }
}
@keyframes rod-down {
  0% {
    transform: scaleY(1);
  }
  60% {
    transform: scaleY(0);
  }
  80% {
    transform: scaleY(-0.2);
  }
  100% {
    transform: scaleY(1);
  }
}
@keyframes ball-down {
  0% {
    transform: translateY(0);
  }
  60% {
    transform: translateY(40px);
  }
  80% {
    transform: translateY(60px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
