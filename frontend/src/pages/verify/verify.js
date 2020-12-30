/* eslint-disable */

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import { JSEncrypt } from 'jsencrypt'

Vue.use(ElementUI)
Vue.prototype.$axios = axios

var vm = new Vue({
  el: '#app',
  data: function () {
    return {
      email: '',
      verification: ''
    }
  },
  methods: {
    verify: function () {
      let data = {
        "email": this.email,
        "verification": this.verification
      }
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }
      this.$axios.post('http://127.0.0.1:8000/user/verify', JSON.stringify(data), config)
        .then(
          (res) => {
            res = res.data
            if (res.code === 200) {
              alert("验证成功")
              window.location.href = "http://127.0.0.1:8000/user/login.html"
            } else {
              alert("验证失败")
            }
          }
        )
    }
  }
})
