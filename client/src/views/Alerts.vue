<template>
  <div class='overlay'>
    <div :style='style' :class='getClass'>
      <p>{{info.text}}</p>
      <hr>
      <input type='button' :value='button.ok' @click='callbacks'>
    </div>
  </div>
</template>

<script>
import {centerElement, isEmpty} from '@/classes/mainFunctions'
export default {
  name: 'alert-box',
  props: ['info'],
  data () {
    return {
      style: '',
      class: ['alert-box', 'shadow'],
      button: {
        ok: 'Aceptar'
      }
    }
  },
  methods: {
    callbacks () {
      if (this.info.callbacks) {
        if (typeof this.info.callbacks === 'function') {
          this.info.callbacks()
        } else {
          this.info.callbacks.forEach((callback, idx) => {
            callback(idx)
          })
        }
      }

      this.class.push('fadeOut')

      setTimeout(() => this.$root.removeFromAlert(this.$vnode.key), 250)
    },
    center () {
      return centerElement(this)
    }
  },
  computed: {
    getClass () {
      return this.class.join(' ')
    }
  },
  created () {
    if (typeof this.info.button === 'object' && !isEmpty(this.info.button.ok)) {
      this.button.ok = this.info.button.ok
    }

    window.addEventListener('resize', this.center)
    this.center()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.center)
  }
}
</script>
