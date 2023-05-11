<template>
  <div id="app">
    <div class="canvas" ref="canvas"></div>
    <div class="bpmn-js-properties-panel" id="js-properties-panel"></div>
  </div>
</template>
<script>


//默认样式
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
//左边工作栏的样式
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
// 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 工具栏相关
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import propertiesPanelModule from "bpmn-js-properties-panel";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import {getJson} from '@/api/workflow/model'
// 汉化文件夹
import customTranslate from "./customTranslate";
import {
  xmlStr
} from './default' // 这里是直接引用了xml字符串

export default {
  data() {
    return {
      bpmnModeler: null,
      canvas: null,
      //流程图初始模板代码
      bpmnTemplate: xmlStr
    };
  },
  methods: {
    bpmninit() {
      const customTranslateModule = {
        translate: ['value', customTranslate]
      };
      // 获取画布 element
      this.canvas = this.$refs.canvas;
      // 创建Bpmn对象
      this.bpmnModeler = new BpmnModeler({
        // 设置bpmn的绘图容器为上门获取的画布 element
        container: this.canvas,
        // 加入工具栏支持
        propertiesPanel: {
          parent: "#js-properties-panel"
        },
        additionalModules: [propertiesProviderModule, propertiesPanelModule, customTranslateModule],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      });
      // 初始化建模器内容
      this.initDiagram(this.$route.query.id);
    },
    initDiagram(id) {
      // 将xml导入Bpmn-js建模器
      this.bpmnModeler.importXML(xmlStr, err => {
        if (err) {
          this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        }
      });


    }
  },
  // 生命周期钩子，在组件加载完成后调用init函数进行创建初始化Bpmn-js建模器
  mounted() {
    this.bpmninit();
  }
};
</script>

<style>

.canvas {
  width: 100%;
  height: 100%;
}

.action {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
}

.upload-demo {
  margin-right: 10px;
}

.bpmn-js-properties-panel {
  position: absolute;
  top: 0;
  right: 0px;
  width: 300px;
}


</style>
