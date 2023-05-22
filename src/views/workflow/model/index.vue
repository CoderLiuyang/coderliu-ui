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
            @click="deploy(scope.row, scope.index)"
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
  <!--  <el-dialog title="收货地址" :visible.sync="activitEditer">-->
  <!--    <edit-page></edit-page>-->
  <!--  </el-dialog>-->

  <el-dialog
    v-model="activitEditer"
    title="修改路程图"
    :before-close="handleClose"
    width="80%"
    height="60%"
    destroy-on-close
  >
    <div class='demo-my'>
      <edit-page :modelId="modelId" :modelName="modelName" @fatherMethod="handleClose"></edit-page>
    </div>

    <template #footer>
    </template>
  </el-dialog>
</template>

<script>
import {addObj, delObj, fetchList, putObj,deploy} from '@/api/workflow/model'
import {tableOption} from '@/const/crud/workflow/model'
import {mapGetters} from 'vuex'
import editPage from './edit.vue'


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
      modelId: null,
      modelName: null
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  components: {
    editPage
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

      this.modelId = row.id;
      this.modelName = row.name;
      this.activitEditer = true;
    },
    deploy(row, index) {
      this.$confirm(
        '是否发布(模型名称为:' + row.name + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deploy(row)
          .then(() => {
            this.getList(this.page)
            this.$notify.success('发布成功')
          })
          .catch(() => {
            this.$notify.error('发布失败')
          })
      })
    },
    create(row, done, loading) {
      addObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.$notify.success('创建成功')
        }).catch(() => {
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
    handleClose() {
      this.activitEditer = false;
    }
  }
}
</script>

<style>
.demo-my {
  height: 60vh;
  margin: 0;
  padding: 0;
}
</style>
