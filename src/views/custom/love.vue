<template>
  <div class="love" :class="background">
    <canvas id="heart"></canvas>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  setup() {
    const backgroundList = ['bg1', 'bg2', 'bg3']
    let backgroundIndex = ref(0)
    let width: number
    let height: number
    let heartCanvas: any
    let heartCtx: any
    let heartCls: any

    class Point {
      x: number
      y: number
      size: number
      constructor(x: number, y: number, size?: number) {
        this.x = x
        this.y = y
        this.size = size || 0
      }
    }

    class Heart {
      particles: number
      generateFrame: number
      boardHeart: Point[]
      middleHeart: Point[]
      centerHeart: Point[]
      allHearts: Point[]
      constructor(particles: number, generateFrame: number) {
        this.particles = particles
        this.generateFrame = generateFrame
        this.boardHeart = [] // 爱心的轮廓
        this.middleHeart = [] // 爱心轮廓内部
        this.centerHeart = [] // 爱心中间
        this.allHearts = [] // 所有的爱心粒子
        this.initHeart() // 初始化爱心内部粒子

        for (let i = 0; i < generateFrame; i++) {
          this.calcFrame(i) // 计算 20 帧图像
        }
      }
      initHeart() {
        for (let i = 0; i < this.particles; i++) {
          const deg = (2 * Math.PI * rand(0, 360)) / 360
          this.boardHeart.push(generatorHeart(deg))
        }
        this.boardHeart.forEach((point) => {
          for (let j = 0; j < 3; j++) {
            this.middleHeart.push(scatterHeart(point, 0.05 * rand(j, j + 1, false)))
          }
        })
        for (let i = 0; i < this.particles * 2; i++) {
          const ii = rand(0, this.boardHeart.length - 1)
          this.centerHeart.push(scatterHeart(this.boardHeart[ii], 0.17))
        }

        for (let i = 0; i < this.particles / 4; i++) {
          const ii = rand(0, this.boardHeart.length - 1)
          this.centerHeart.push(scatterHeart(this.boardHeart[ii], 0.35))
        }
      }
      calc_position(point: Point, ratio: number) {
        const force = 1 / ((point.x - width / 2) ** 2 + (point.y - height / 2) ** 2) ** 0.52

        const dx = ratio * force * (point.x - width / 2) + rand(-1, 1, false)
        const dy = ratio * force * (point.y - height / 2) + rand(-1, 1, false)

        return new Point(point.x - dx, point.y - dy, 0)
      }

      calcFrame(frame: number) {
        const ratio = 20 * curve((frame / 18) * Math.PI)
        const haloRadius = Math.floor(4 + 6 * (1 + curve((frame / 18) * Math.PI)))
        const haloNums = Math.floor(
          this.particles * 2 + this.particles * 3 * Math.abs(curve((frame / 18) * Math.PI) ** 2)
        )

        const nowFramePoints: any = []
        const haloSet = new Set()
        for (let i = 0; i < haloNums; i++) {
          const delta = rand(0, 360)
          let point = generatorHeart(2 * Math.PI * (delta / 360))
          let shrinkPoint = shrinkHeart(point, haloRadius)
          if (
            !haloSet.has(JSON.stringify([Math.floor(shrinkPoint.x), Math.floor(shrinkPoint.y)]))
          ) {
            shrinkPoint.x += rand(-20, 20)
            shrinkPoint.y += rand(-20, 20)
            shrinkPoint.size = rand(0.4, 1.4, false)
            nowFramePoints.push(shrinkPoint)
            haloSet.add(JSON.stringify([Math.floor(shrinkPoint.x), Math.floor(shrinkPoint.y)]))
          }
        }

        this.boardHeart.forEach((point) => {
          const calcPoint = this.calc_position(point, ratio)
          calcPoint.size = rand(0.6, 1.6, false)
          nowFramePoints.push(calcPoint)
        })
        this.middleHeart.forEach((point) => {
          const calcPoint = this.calc_position(point, ratio)
          calcPoint.size = rand(0.4, 1.4, false)
          nowFramePoints.push(calcPoint)
        })
        this.centerHeart.forEach((point) => {
          const calcPoint = this.calc_position(point, ratio)
          calcPoint.size = rand(0.4, 1.4, false)
          nowFramePoints.push(calcPoint)
        })

        this.allHearts[frame] = nowFramePoints
      }
    }
    function rand(n: number, m: number, flag = true) {
      var c = m - n
      if (flag) {
        return Math.floor(Math.random() * c + n)
      } else {
        return Math.random() * c + n
      }
    }
    function scatterHeart(point: Point, beta = 0.15) {
      let ratio_x = -beta * Math.log(Math.random())
      let ratio_y = -beta * Math.log(Math.random())

      let dx = ratio_x * (point.x - width / 2)
      let dy = ratio_y * (point.y - height / 2)

      return new Point(point.x - dx, point.y - dy)
    }
    function curve(x: number) {
      return (2 * (2 * Math.sin(4 * x))) / (2 * Math.PI)
    }
    function shrinkHeart(point: Point, ratio: number) {
      let force = -1 / ((point.x - width / 2) ** 2 + (point.y - height / 2) ** 2) ** 0.6
      let dx = ratio * force * (point.x - width / 2)
      let dy = ratio * force * (point.y - height / 2)
      return new Point(point.x - dx, point.y - dy, 0)
    }
    // scale 为放大倍数
    // width height 为画布大小，将生成的爱心移到画布中央
    const generatorHeart: (t: number, scale?: number) => Point = (
      t: number,
      scale: number = 11.6
    ) => {
      let x = 16 * Math.sin(t) ** 3
      let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
      x = x * scale + width / 2
      y = y * scale + height / 2
      return new Point(x, y)
    }

    const hearts = []
    for (let i = 0; i < 360; i++) {
      hearts.push(generatorHeart(2 * Math.PI * (i / 360)))
    }

    // function drawHeart2(context, points) {
    //     context.beginPath();
    //     points.forEach((point) => {
    //         context.strokeStyle = "#00ffff";
    //         context.lineTo(point.x, point.y);
    //         context.stroke();
    //     });
    //     context.closePath();
    // }

    function render(k: number) {
      heartCtx.clearRect(0, 0, width, height)
      drawHeart(heartCtx, heartCls.allHearts[k])
    }

    function drawHeart(context: any, points: any) {
      points.forEach((point: Point) => {
        context.beginPath()
        // #ed1c24
        // #003EDB
        // "#00A2E9"
        context.fillStyle = 'rgba(255,182,153,0.7)'
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        context.fill()
        context.closePath()
      })
    }
    onMounted(() => {
      width = window.innerWidth
      height = window.innerHeight
      heartCanvas = document.getElementById('heart')
      heartCtx = heartCanvas.getContext('2d')
      heartCanvas.width = width
      heartCanvas.height = height
      heartCls = new Heart(2000, 20)

      // 动画开始
      let k = 0
      ;(function animateloop() {
        k++
        k = k % 80
        if (k % 4 === 0) {
          render(k / 4)
        }
        if (k % 30 === 0) {
          console.warn(backgroundIndex)
          backgroundIndex.value === backgroundList.length - 1
            ? (backgroundIndex.value = 0)
            : backgroundIndex.value++
        }
        requestAnimationFrame(animateloop)
      })()
    })
    return {
      background: computed(() => backgroundList[backgroundIndex.value]),
    }
  },
})
</script>
<style lang="less" scoped>
.love {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.love.bg1 {
  background-image: url('@/assets/lly/bg1.JPG');
}

.love.bg2 {
  background-image: url('@/assets/lly/bg2.png');
}

.love.bg3 {
  background-image: url('@/assets/lly/bg3.JPG');
}
</style>
