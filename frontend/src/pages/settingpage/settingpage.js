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
    created: function() {
        this.get_user_information()
    },
    data: function () {
        return {
            email: '',
            name: '',
            photo: '',
            password: '',
            repeat_password: '',
            message: '',
            searchInput: '',
            public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAnAIl6VFrjwPg6v2qGMMywlOPoS/fqCk68MHt7RGroVlZJvucD7DqZJDrMyj0Y7VgCsnonsFRPlVB/PDOfywx8WT8UBzeLojjMIYIlET5QxAWvArcG6D6jiolcTDzyFPCjaeb2v4DkniqBvPaOitjm5TEI/wkV0wP9AzpbixDBQIDAQAB'
        }
    },
    methods: {
        check: function () {
            if (this.name === '')
                this.message = '用户名不能为空'
            else if (this.password === this.repeat_password)
                this.message = ''
            else
                this.message = '密码不一致'
        },
        change: function () {
            this.check()
            if (this.message !== '')
                return
            let data = {
                "name": this.name,
                "password": this.encrypt_data(this.password)
            }
            let config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
            }
            this.$axios.post('http://127.0.0.1:8000/user/change_user_information', JSON.stringify(data), config)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code !== 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('failed to initialize')
                            return
                        }
                        if (this.password !== '')
                            window.location.href = 'http://127.0.0.1:8000/user/login.html'
                        else
                            window.location.href = 'http://127.0.0.1:8000/user/myprofile.html'
                    }
                )
        },
        handle_avatar_success: function (res, file) {
            this.photo = URL.createObjectURL(file.raw)
        },
        before_avatar_upload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isLt2M) {
                alert('上传头像图片大小不能超过 2MB!')
            }
            return isLt2M
        },
        to_home_page: function () {
            window.location.href = "http://127.0.0.1:8000/SearchAndResults/HomePage.html"
        },
        to_my_profile_page: function () {
            window.location.href = 'http://127.0.0.1:8000/user/myprofile.html'
        },
        quit: function () {
            this.$axios.post('http://127.0.0.1:8000/user/logout')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code !== 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('failed to initialize')
                            return
                        }
                        window.location.href = 'http://127.0.0.1:8000/user/login.html'
                    }
                )
        },
        handle_command: function (command) {
            if (command === 'a') this.to_home_page()
            else if (command === 'b') this.to_my_profile_page()
            else if (command === 'c') this.quit()
        },
        get_user_information: function () {
            this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code !== 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('failed to initialize')
                            return
                        }
                        this.name = res.data.information.user_name
                        this.email = res.data.information.user_email
                        if (res.data.information.user_photo !== '')
                            this.photo = res.data.information.user_photo
                        else
                            this.photo = ''
                    }
                )
        },
        handleSearch() {
            if (this.searchInput.length > 0) {
                var searchContent = btoa(encodeURI(this.searchInput))
                window.location.href = 'http://127.0.0.1:8000/SearchAndResults/SearchResultPage.html?searchContent=' + searchContent
            }
        },
        encrypt_data: function (data) {
            var password_old = data
            let encrypt = new JSEncrypt()
            encrypt.setPublicKey(this.public_key)
            var pass_new = encrypt.encrypt(password_old)
            return pass_new
        }
    }
})
