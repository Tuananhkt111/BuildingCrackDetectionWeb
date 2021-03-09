<template>
<div class="loading" v-if="isLoading">
    <div style="margin-left: auto; margin-right: auto">
  <div class="cube1"></div>
  <div class="cube2"></div>
    </div>
</div>
</template>

<script>
export default {
 name: "LoadingScreen",
  props: ['isLoading']
}
</script>

<style>
.loading {
  z-index:10000;
  width: 100%;
  height: 100%;
  margin: auto;
  position: relative;
}
.cube1, .cube2 {
  background-color:#b9cee4;
  width: 15px;
  height: 15px;
  position: absolute;
  top: 0;
  left: 44%;
  -webkit-animation: sk-cubemove 1.8s infinite ease-in-out;
  animation: sk-cubemove 1.8s infinite ease-in-out;
}

.cube2 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

@-webkit-keyframes sk-cubemove {
  25% { -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5) }
  50% { -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg) }
  75% { -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5) }
  100% { -webkit-transform: rotate(-360deg) }
}

@keyframes sk-cubemove {
  25% { 
    transform: translateX(42px) rotate(-90deg) scale(0.5);
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  } 50% { 
    transform: translateX(42px) translateY(42px) rotate(-179deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
  } 50.1% { 
    transform: translateX(42px) translateY(42px) rotate(-180deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  } 75% { 
    transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
  } 100% { 
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>