/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import $ from 'jquery'
import pdfvuer from 'pdfvuer'
import 'pdfvuer/dist/pdfvuer.css'
/*import * as test from 'pdfjs-dist/webpack'
import pdfAnnotate from 'pdf-annotate-vue'
import "pdf-annotate-vue/src/css/toolbar.css";
import "pdf-annotate-vue/src/css/pdf_viewer.css";
*/


Vue.use(ElementUI)
Vue.prototype.$axios = axios

Vue.component('showpdf', {
    components: {
        pdf: pdfvuer
    },
    props: ['src'],
    data: function () {
        return {
            page: 1,
            numPages: 0,
            errors: [],
            pdfdata: undefined,
            scale: 'page-width',
        }
    },
    computed: {
        formattedZoom() {
            return Number.parseInt(this.scale * 100)
        },
    },
    mounted() {
        this.getPdf()
    },
    watch: {
        show: function (s) {
            if (s) {
                this.getPdf()
            }
        },
        page: function (p) {
            if (window.pageYOffset <= this.findPos(document.getElementById(p)) || (document.getElementById(p + 1) && window.pageYOffset >= this.findPos(document.getElementById(p + 1)))) {
                document.getElementById(p).scrollIntoView()
            }
        }
    },
    methods: {
        getPdf() {
            var self = this
            self.pdfdata = pdfvuer.createLoadingTask(this.src);
            self.pdfdata.then(pdf => {
                self.numPages = pdf.numPages
                window.onscroll = function () {
                    changePage()
                }
                function changePage() {
                    var i = 1,
                        count = Number(pdf.numPages);
                    do {
                        if (window.pageYOffset >= self.findPos(document.getElementById(i)) &&
                            window.pageYOffset <= self.findPos(document.getElementById(i + 1))) {
                            self.page = i
                        }
                        i++
                    } while (i < count)
                    if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
                        self.page = i
                    }
                }
            });
        },
        findPos(obj) {
            return obj.offsetTop;
        }
    },
    template: '<div id="pdfvuer">\
                <pdf :src="pdfdata" v-for="i in numPages" :key="i" :id="i" :page="i"\
                  :scale.sync="scale" style="width:100%;margin:20px auto;" :annotation="true">\
                    <template slot="loading">\
                        loading content here...\
                    </template>\
                </pdf>\
            </div>'
})

var vm = new Vue({
    el: '#app',
    created: function () {
        this.initDatas()
    },
    data: {
        paperId: 0,
        handleClick: 0,
        pdf_src: '',
    },
    methods: {
        handle_click: function (event) {
            var pagediv = document.getElementsByClassName('page')[0]
            var pdf_x = parseInt(pagediv.style.width.slice(0, -2))
            var pdf_y = parseInt(pagediv.style.height.slice(0, -2)) + 20    // 抵消间距
            var div = document.getElementById('pdf')
            event = event || window.event
            //2.获取鼠标在整个页面的位置
            var pagex = event.pageX || scroll().left + event.clientX
            var pagey = event.pageY || scroll().top + event.clientY
            //3.获取盒子在整个页面的位置
            var xx = div.offsetLeft
            var yy = div.offsetTop
            //4.用鼠标的位置减去盒子的位置赋值给盒子的内容
            var targetx = pagex - xx
            var targety = pagey - yy
            window.parent.postMessage({
                data: [
                    targetx / pdf_x,
                    (targety % pdf_y) / pdf_y,
                    Math.floor(targety / pdf_y)
                ]}, '*')
        },
        initDatas() {
            this.paperId = parseInt(this.getParams("id"))
            this.handleClick = parseInt(this.getParams("handleClick"))
            this.pdf_src = 'http://127.0.0.1:8000/commentarea/get_paper?paperId=' + this.paperId
        },
        getParams(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
            var r = window.location.search.substr(1).match(reg)
            if (r !== null) {
                return unescape(r[2])
            }
            return null
        },
    }
})