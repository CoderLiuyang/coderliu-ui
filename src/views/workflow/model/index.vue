<template>
  <div class="user">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
        v-model:page="page"
        :option="option"
        :table-loading="listLoading"
        :data="list"
        @on-load="getList"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-change="handleFilter"
        @refresh-change="handleRefreshChange"
        @row-update="update"
        @row-save="create"
      >
        <template #menu="scope">
          <el-button
            v-if="permissions.sys_user_edit"
            text
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, scope.index)"
          >编辑
          </el-button>
          <el-button
            v-if="permissions.sys_user_edit"
            text
            type="primary"
            icon="el-icon-edit"
            @click="devops(scope.row, scope.index)"
          >部署
          </el-button>
          <!--          <el-button-->
          <!--            v-if="permissions.sys_user_edit"-->
          <!--            text-->
          <!--            type="primary"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="exportPBMN(scope.row, scope.index)"-->
          <!--          >导出-->
          <!--          </el-button>-->
          <el-button
            v-if="permissions.sys_user_del"
            text
            type="primary"
            icon="el-icon-delete"
            @click="deletes(scope.row, scope.index)"
          >删除
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>

  <!--  <el-dialog-->
  <!--    v-model="activitEditer"-->
  <!--    title="编辑流程图"-->
  <!--    width="100%"-->
  <!--    heigh="100vh"-->
  <!--    destroy-on-close-->
  <!--    center-->
  <!--  >-->
  <!--    <div class="canvas" ref="canvas"></div>-->
  <!--    <div class="bpmn-js-properties-panel" id="js-properties-panel"></div>-->
  <!--  </el-dialog>-->
</template>

<script>
import {addObj, delObj, fetchList, putObj, getJson} from '@/api/workflow/model'
import {tableOption} from '@/const/crud/workflow/model'
import {mapGetters} from 'vuex'
import {ref} from 'vue'


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
//import propertiesProviderModule from 'houtaroy-bpmn-js-properties-panel-activiti/lib/provider/activiti';

// 汉化文件夹
import customTranslate from "./customTranslate";
import {
  xmlStr
} from './default' // 这里是直接引用了xml字符串


export default {
  name: 'workflow_model',
  data() {
    return {
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false //是否倒序npom
      },
      query: {},
      list: [],
      listLoading: true,
      post: [],
      role: [],
      form: {},
      postOptions: [],
      rolesOptions: [],
      activitEditer: false,
      canvas: null
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList(page, params) {
      this.listLoading = true
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then(response => {
        this.list = response.data.data.records
        console.table(this.list)
        this.page.total = response.data.data.total
        this.listLoading = false
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    handleFilter(param, done) {
      this.query = param
      this.page.currentPage = 1
      this.getList(this.page, param)
      done()
    },
    handleRefreshChange() {
      this.getList(this.page)
    },
    handleUpdate(row, index) {
      // this.activitEditer = true;
      // const customTranslateModule = {
      //   translate: ['value', customTranslate]
      // };
      // // 获取画布 element
      // this.canvas = this.$refs.canvas;
      // debugger
      // console.log(this.canvas)
      //
      // // 创建Bpmn对象
      // this.bpmnModeler = new BpmnModeler({
      //   // 设置bpmn的绘图容器为上门获取的画布 element
      //   container: this.canvas,
      //   // 加入工具栏支持
      //   propertiesPanel: {
      //     parent: "#js-properties-panel"
      //   },
      //   additionalModules: [propertiesProviderModule, customTranslateModule],
      //   moddleExtensions: {
      //     camunda: camundaModdleDescriptor
      //   }
      // });
      //
      // // 初始化建模器内容
      // this.initDiagram(xmlStr);
      //this.createNewDiagram(row.id)
      this.$router.push({
        path: 'edit',
        query: {id: row.id}
      })
    },
    createNewDiagram(id) {
      //获取xml
      getJson(id)
        .then(a => {
          // 将字符串转换成图显示出来
          this.bpmnModeler.importXML(JSON.stringify(a.data.data), (err) => {
            if (err) {
              // console.error(err)
            } else {
              // 这里是成功之后的回调, 可以在这里做一系列事情
              this.success()
            }
          })
        })
        .catch(() => {
          this.$notify.error('流程图加载失败！')
        })

    },
    devops(row, index) {
      alert("部署")
    },
    exportPBMN(row, index) {
      alert("导出")
    },
    create(row, done, loading) {
      addObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.$notify.success('创建成功')
        })
        .catch(() => {
          loading()
        })
    },
    update(row, index, done, loading) {
      console.log('this.form', this.form)
      putObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.$notify.success('修改成功')
        })
        .catch(() => {
          loading()
        })
    },
    deletes(row) {
      this.$confirm(
        '此操作将永久删除该流程模型(模型名称为:' + row.name + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delObj(row.id)
          .then(() => {
            this.getList(this.page)
            this.$notify.success('删除成功')
          })
          .catch(() => {
            this.$notify.error('删除失败')
          })
      })
    },
    exportExcel() {
      this.downBlobFile('/admin/user/export', this.query, 'user.xlsx')
    }
  }
}
</script>
