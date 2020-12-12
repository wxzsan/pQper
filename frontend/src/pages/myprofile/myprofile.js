/* eslint-disable */

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.prototype.$axios = axios

var vm = new Vue({
  el: '#app',
  data: function () {
    return {
      email: '',
      name: '',
      photo: ''
    }
  },
  methods: {
    get_user_information: function () {
      this.$axios.get('http://127.0.0.1:8000/user/get_user_information')
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://127.0.0.1:8000/user/login.html'
          } else if (res.code === 200) {
            this.name = res.data.name
            this.email = res.data.email
            this.photo = '/static' + res.data.photo;
          } else {
            alert('用户不存在')
          }
        })
    },
    to_setting_page: function () {
      window.location.href = 'http://127.0.0.1:8000/user/settingpage.html'
    }
  }
})
vm.get_user_information()
