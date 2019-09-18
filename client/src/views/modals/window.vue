<template>
	<Overlay :node="node">
		<template slot="body">
			<div>
				<p v-if="data.title" class="title">
					{{data.title}}
				</p>
				<br v-if="data.title">
				<template v-if="isSuccess">
					<div class="checkmark-circle">
				  		<div class="background"></div>
				  		<div class="checkmark draw"></div>
					</div>
				</template>
				<template v-else>
					<div class="sa">
					  <div class="sa-error">
					    <div class="sa-error-x">
					      <div class="sa-error-left"></div>
					      <div class="sa-error-right"></div>
					    </div>
					    <div class="sa-error-placeholder"></div>
					    <div class="sa-error-fix"></div>
					  </div>
					</div>
				</template>				
				<br>				
				<p class="message">{{data.message}}</p>
			</div>
		</template>
	</Overlay>	
</template>

<style scoped>

	.title {
		font-weight: bold;
		font-size: 25px;
		text-align: center;
		color: #848484;
	}

	.sa {
	  width: 140px;
	  height: 140px;
	  padding: 26px;
	  background-color: #fff;
	  left: 50%;
      transform: translateX(-50%);
      position: relative;
	}
	.sa-error {
	  border-radius: 50%;
	  border: 4px solid #F27474;
	  box-sizing: content-box;
	  height: 80px;
	  padding: 0;
	  position: relative;
	  background-color: #fff;
	  width: 80px;
	  animation: animateErrorIcon .5s;
	}
	.sa-error:after, .sa-error:before {
	  background: #fff;
	  content: '';
	  height: 120px;
	  position: absolute;
	  transform: rotate(45deg);
	  width: 60px;
	}
	.sa-error:before {
	  border-radius: 40px 0 0 40px;
	  width: 26px;
	  height: 80px;
	  top: -17px;
	  left: 5px;
	  transform-origin: 60px 60px;
	  transform: rotate(-45deg);
	}
	.sa-error:after {
	  border-radius: 0 120px 120px 0;
	  left: 30px;
	  top: -11px;
	  transform-origin: 0 60px;
	  transform: rotate(-45deg);
	  animation: rotatePlaceholder 4.25s ease-in;
	}
	.sa-error-x {
	  display: block;
	  position: relative;
	  z-index: 2;
	}
	.sa-error-placeholder {
	  border-radius: 50%;
	  border: 4px solid rgba(200, 0, 0, 0.2);
	  box-sizing: content-box;
	  height: 80px;
	  left: -4px;
	  position: absolute;
	  top: -4px;
	  width: 80px;
	  z-index: 2;
	}
	.sa-error-fix {
	  background-color: #fff;
	  height: 90px;
	  left: 28px;
	  position: absolute;
	  top: 8px;
	  transform: rotate(-45deg);
	  width: 5px;
	  z-index: 1;
	}
	.sa-error-left, .sa-error-right {
	  border-radius: 2px;
	  display: block;
	  height: 5px;
	  position: absolute;
	  z-index: 2;
	  background-color: #F27474;
	  top: 37px;
	  width: 47px;
	}
	.sa-error-left {
	  left: 17px;
	  transform: rotate(45deg);
	  animation: animateXLeft .75s;
	}
	.sa-error-right {
	  right: 16px;
	  transform: rotate(-45deg);
	  animation: animateXRight .75s;
	}

	@keyframes rotatePlaceholder {
	  0%, 5% {
	    transform: rotate(-45deg);
	  }
	  100%,12% {
	    transform: rotate(-405deg);
	  }
	}
	@keyframes animateErrorIcon {
	  0% {
	    transform: rotateX(100deg);
	    opacity: 0;
	  }
	  100% {
	    transform: rotateX(0deg);
	    opacity: 1;
	  }
	}
	@keyframes animateXLeft {
	  0%, 65% {
	    left: 82px;
	    top: 95px;
	    width: 0;
	  }
	  84% {
	    left: 14px;
	    top: 33px;
	    width: 47px;
	  }
	  100% {
	    left: 17px;
	    top: 37px;
	    width: 47px;
	  }
	}
	@keyframes animateXRight {
	  0%, 65% {
	    right: 82px;
	    top: 95px;
	    width: 0;
	  }
	  84% {
	    right: 14px;
	    top: 33px;
	    width: 47px;
	  }
	  100% {
	    right: 16px;
	    top: 37px;
	    width: 47px;
	  }
	}


	.message {
		margin-top: 20px;
		text-align: center;
		margin-bottom: 10px;
	}

	.checkmark-circle {
	  width: 150px;
	  height: 150px;
	  position: relative;
	  display: inline-block;
	  vertical-align: top;
      left: 50%;
      transform: translateX(-50%);
	}
	.checkmark-circle .background {
	  width: 150px;
	  height: 150px;
	  border-radius: 50%;
	  background: #1ab394;
	  position: absolute;
	}
	.checkmark-circle .checkmark {
	  border-radius: 5px;
	}
	.checkmark-circle .checkmark.draw:after {
	  animation-delay: 300ms;
	  animation-duration: 1s;
	  animation-timing-function: ease;
	  animation-name: checkmark;
	  transform: scaleX(-1) rotate(135deg);
	  animation-fill-mode: forwards;
	}
	.checkmark-circle .checkmark:after {
	  opacity: 1;
	  height: 75px;
	  width: 37.5px;
	  transform-origin: left top;
	  border-right: 15px solid #fff;
	  border-top: 15px solid #fff;
	  border-radius: 2.5px !important;
	  content: '';
	  left: 35px;
	  top: 80px;
	  position: absolute;
	}

	@keyframes checkmark {
	  0% {
	    height: 0;
	    width: 0;
	    opacity: 1;
	  }
	  20% {
	    height: 0;
	    width: 37.5px;
	    opacity: 1;
	  }
	  40% {
	    height: 75px;
	    width: 37.5px;
	    opacity: 1;
	  }
	  100% {
	    height: 75px;
	    width: 37.5px;
	    opacity: 1;
	  }
	}


</style>

<script type="text/javascript">
	import Overlay from './overlay'

	export default {
		name: 'Alert',
		props: {
			data: Object
		},
		methods: {
			close () {
				this.$children[0].close()
			}
		},
		computed: {
			isSuccess () {
				return this.data.type == 'success'
			},
			node () {
				return {
					key: this.$vnode.key,
					type: 'Window',
					closeButton: true
				}
			}
		},
		components: {
			Overlay
		}
	}
</script>