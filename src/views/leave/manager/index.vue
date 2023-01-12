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
            @click="submitProcess(scope.row, scope.index)"
          >提交申请
          </el-button>
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


</template>

<script>
import {addObj, delObj, fetchList, putObj,submitProcess} from '@/api/leave/manager'
import {tableOption} from '@/const/crud/leave/manager'
import {mapGetters} from 'vuex'

export default {
  name: 'work_flow_model',
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
      form: {},
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
    submitProcess(row, index) {
      submitProcess(row.id)
        .then(() => {

          this.$notify.success('提交成功');
        }).catch(() => {
          loading()
        })

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
        '此操作将永久删除该用户(用户名:' + row.userName + '), 是否继续?',
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
