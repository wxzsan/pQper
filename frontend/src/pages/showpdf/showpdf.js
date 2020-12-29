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
      scale: 'page-width'
    }
  },
  computed: {
    formattedZoom() {
      return Number.parseInt(this.scale * 100);
    },
  },
  mounted() {
    this.getPdf()
  },
  watch: {
    show: function (s) {
      if (s) {
        this.getPdf();
      }
    },
    page: function (p) {
      if (window.pageYOffset <= this.findPos(document.getElementById(p)) || (document.getElementById(p + 1) && window.pageYOffset >= this.findPos(document.getElementById(p + 1)))) {
        // window.scrollTo(0,this.findPos(document.getElementById(p)));
        document.getElementById(p).scrollIntoView();
      }
    }
  },
  methods: {
    getPdf() {
      var self = this;
      self.pdfdata = pdfvuer.createLoadingTask(this.src);
      self.pdfdata.then(pdf => {
        self.numPages = pdf.numPages;
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
    data: function () {
      return {
        pdf_src: '/static/A_Mathematical_Theory_of_Communication.pdf'
      }
    },
    methods: {
      handle_click: function (event) {
        var div = document.getElementById('pdf')
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
        console.log('目标x：' + targetx)
        console.log('目标y：' + targety)
      },
      _loadFile: function (url) { //初始化pdf
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
      _renderPage: function (num) {
        this.pdfDoc.getPage(num)
          .then((page) => {
            var scale = 1;
            var viewport = page.getViewport(scale);
            var $canvas = $('#the-canvas' + num);
            var canvas = $canvas.get(0);
            var context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var $pdfContainer = $("#pdf");
            $pdfContainer.css("height", canvas.height + "px")
              .css("width", canvas.width + "px");

            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            page.render(renderContext);
            this.setupAnnotations(page, viewport, $canvas, $('#annotation-layer' + num));
            if (num < this.pdf_pages) {
              this._renderPage(num + 1)
            }
          })
      },
      setupAnnotations: function (page, viewport, $canvas, $annotationLayerDiv) {
        //var canvasOffset = $(canvas).offset();
        var promise = page.getAnnotations()
          .then(function (annotationsData) {
            /*viewport = viewport.clone({
              dontFlip: true
            });

            for (var i = 0; i < annotationsData.length; i++) {
              var data = annotationsData[i];
              console.log(page.commonObjs)
              var element = PDFJS.AnnotationUtils.getHtmlElement(page.commonObjs);
              var rect = data.rect;
              var view = page.view;
              rect = PDFJS.Util.normalizeRect([
                rect[0],
                view[3] - rect[1] + view[1],
                rect[2],
                view[3] - rect[3] + view[1]
              ]);
              element.style.left = (canvasOffset.left + rect[0]) + 'px';
              element.style.top = (canvasOffset.top + rect[1]) + 'px';
              element.style.position = 'absolute';

              var transform = viewport.transform;
              var transformStr = 'matrix(' + transform.join(',') + ')';
              CustomStyle.setProp('transform', element, transformStr);
              var transformOriginStr = -rect[0] + 'px ' + -rect[1] + 'px';
              CustomStyle.setProp('transformOrigin', element, transformOriginStr);

              if (data.subtype === 'Link' && !data.url) {
                // In this example,  I do not handle the `Link` annotations without url.
                // If you want to handle those links, see `web/page_view.js`.
                continue;
              }
              $annotationLayerDiv.append(element);
            }*/
            var pdf_canvas = $canvas

            // Canvas offset
            var canvas_offset = pdf_canvas.offset();

            // Canvas height
            var canvas_height = pdf_canvas.get(0).height;

            // Canvas width
            var canvas_width = pdf_canvas.get(0).width;

            // CSS for annotation layer
            $annotationLayerDiv.css({ left: canvas_offset.left + 'px', top: canvas_offset.top + 'px', height: canvas_height + 'px', width: canvas_width + 'px' });

            // Render the annotation layer
            PDFJS.AnnotationLayer.render({
              viewport: viewport.clone({ dontFlip: true }),
              div: $annotationLayerDiv.get(0),
              annotations: annotationsData,
              page: page
            });
          });
        return promise;
      }
    }
  })
  //vm._loadFile(vm.pdf_src)

/*function Annotation_fromData(data) {
  var subtype = data.subtype;
  var fieldType = data.fieldType;
  var Constructor = PDFAnnotations.getConstructor(subtype, fieldType);
  if (Constructor) {
    return new Constructor({ data: data });
  }
}
*/
