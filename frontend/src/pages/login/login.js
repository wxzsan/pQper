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
  data: function() {
    return {
      email: '',
      password: '',
      message: '请输入以上信息',
      public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAnAIl6VFrjwPg6v2qGMMywlOPoS/fqCk68MHt7RGroVlZJvucD7DqZJDrMyj0Y7VgCsnonsFRPlVB/PDOfywx8WT8UBzeLojjMIYIlET5QxAWvArcG6D6jiolcTDzyFPCjaeb2v4DkniqBvPaOitjm5TEI/wkV0wP9AzpbixDBQIDAQAB'
    }
  },
  methods: {
    try_login: function() {
      this.check()
      if (this.message !== '') {
        return
      }
      let data = {
        "email": this.email,
        "password": this.encrypt_data(this.password)
      }
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }
      this.$axios.post('http://127.0.0.1:8000/user/login', JSON.stringify(data), config)
        .then(
          (res) => {
            res = res.data
            if (res.code === 200) {
              window.location.href = "http://127.0.0.1:8000/SearchAndResults/HomePage.html"
            } else {
              alert("登录失败")
            }
          }
        )
    },
    to_register: function() {
      window.location.href = "http://127.0.0.1:8000/user/register.html";
    },
    check_email: function() {
      if (this.email.length === 0 || this.email.indexOf("@") === -1) {
        return false
      }
      return true
    },
    check_password: function() {
      if (this.password.length <= 5) {
        return false
      }
      return true
    },
    check: function() {
      if (!this.check_email()) {
        this.message = '邮箱格式错误'
        return
      }
      if (!this.check_password()) {
        this.message = '密码格式错误'
        return
      }
      this.message = ''
    },
    encrypt_data: function(data) {
      var password_old = data
      let encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.public_key)
      var pass_new = encrypt.encrypt(password_old)
      return pass_new
    }
  }
})