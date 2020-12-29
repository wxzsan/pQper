/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'


Vue.use(ElementUI)
Vue.prototype.$axios = axios

let PDFJS = require('pdfjs-dist')

var vm = new Vue({
    el: '#app',
    created: function () {
        this.initDatas()
        this._loadFile(this.pdf_src)
    },
    data: {
        paperId: 0,
        pdf_src: '',
        pdf_scale: 1.0, //pdf放大系数
        pdf_pages: [],
        pdf_div_width: '',
        pdf_x: 0,
        pdf_y: 0,
    },
    methods: {
        getParams(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            }
            return null
        },
        initDatas() {
            this.paperId = parseInt(this.getParams("id"))
            this.pdf_src = 'http://127.0.0.1:8000/commentarea/get_paper?paperId=' + this.paperId
        },
        handle_click: function (event) {
            var div = document.getElementById('the-canvas1')
            event = event || window.event;
            //2.获取鼠标在整个页面的位置  
            var pagex = event.pageX || scroll().left + event.clientX;
            var pagey = event.pageY || scroll().top + event.clientY;
            //3.获取盒子在整个页面的位置  
            var xx = div.offsetLeft;
            var yy = div.offsetTop
            //4.用鼠标的位置减去盒子的位置赋值给盒子的内容。  
            var targetx = pagex - xx;
            var targety = pagey - yy;
            window.parent.postMessage({
                data: [
                    targetx / this.pdf_x,
                    (targety % this.pdf_y) / this.pdf_y,
                    Math.floor(targety / this.pdf_y)
                ]}, '*')
        },
        _loadFile(url) { //初始化pdf
            let loadingTask = PDFJS.getDocument(url)
            loadingTask.promise
                .then((pdf) => {
                    this.pdfDoc = pdf
                    this.pdf_pages = this.pdfDoc.numPages
                    this.$nextTick(() => {
                        this._renderPage(1)
                    })
                })
        },
        _renderPage(num) { //渲染pdf页
            const that = this
            this.pdfDoc.getPage(num)
                .then((page) => {
                    let canvas = document.getElementById('the-canvas' + num)
                    let ctx = canvas.getContext('2d')
                    let dpr = window.devicePixelRatio || 1
                    let bsr = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio ||
                        ctx.msBackingStorePixelRatio ||
                        ctx.oBackingStorePixelRatio ||
                        ctx.backingStorePixelRatio || 1
                    let ratio = dpr / bsr
                    let viewport = page.getViewport({ scale: this.pdf_scale })
                    canvas.width = viewport.width * ratio
                    canvas.height = viewport.height * ratio
                    canvas.style.width = viewport.width + 'px'
                    that.pdf_div_width = viewport.width + 'px'
                    canvas.style.height = viewport.height + 'px'
                    that.pdf_x = viewport.width
                    that.pdf_y = viewport.height + 5    // 抵消页之间的距离
                    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
                    let renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    }
                    page.render(renderContext)
                    if (this.pdf_pages > num) {
                        this._renderPage(num + 1)
                    }
                })
        }
    }
})