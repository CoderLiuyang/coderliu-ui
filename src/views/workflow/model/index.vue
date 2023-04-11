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

  <el-dialog
    v-model="activitEditer"
    title="Notice"
    width="30%"
    destroy-on-close
    center
  >

    <template>
      <div class="containers">
        <div class="canvas" ref="canvas"></div>
      </div>
    </template>

  </el-dialog>
</template>

<script>
import {addObj, delObj, fetchList, putObj, getJson} from '@/api/workflow/model'
import {tableOption} from '@/const/crud/workflow/model'
import {mapGetters} from 'vuex'
import {ref} from 'vue'


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
      activitEditer: false
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
      this.activitEditer = true;

      // 获取到属性ref为“canvas”的dom节点
      const canvas = ref(null)
      // 建模
      this.bpmnModeler = new BpmnModeler({container: canvas})
      this.createNewDiagram(row.id)
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
