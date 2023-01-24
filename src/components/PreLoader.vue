<template>
  <div class="preloader-wrap">
    <div class="loader">
      <span>L</span>
      <span>O</span>
      <span>A</span>
      <span>D</span>
      <span>I</span>
      <span>N</span>
      <span>G</span>

      <div class="covers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreLoader',
};
</script>

<style scoped lang="sass">
  .preloader-wrap
    position: fixed
    display: flex
    align-items: center
    // width: 100%
    // height: 100%
    top: 0
    right: 0
    bottom: 0
    left: 0
    // background-color: rgb(0 0 0 / 50%)
    z-index: 10

.loader
  position: relative
  margin: auto
  width: 350px
  color: black
  font-family: "PressStart"
  font-size: 200%
  text-align: center
  background: #9eff00
  // text-shadow: 5px 5px 5px rgba(0,0,0,0.3)

.loader:after
  content: ""
  display: table
  clear: both

span
  float: left
  height: 100px
  line-height: 120px
  width: 50px

.loader > span
  border-left: 1px solid #cfff80
  border-right: 1px solid #8adf00

.covers
  position: absolute
  height: 100%
  width: 100%

.covers span
  background: rgb(0 0 0 / 60%)
  animation: up 1.5s infinite

@keyframes up
  0%
    margin-bottom: 0
  30%
    margin-bottom: 100%
    height: 20px
  50%
    margin-bottom: 0
  100%
    margin-bottom: 0

.covers span:nth-child(2)
  animation-delay: .142857s
.covers span:nth-child(3)
  animation-delay: .285714s
.covers span:nth-child(4)
  animation-delay: .428571s
.covers span:nth-child(5)
  animation-delay: .571428s
.covers span:nth-child(6)
  animation-delay: .714285s
.covers span:nth-child(7)
  animation-delay: .857142s

</style>
