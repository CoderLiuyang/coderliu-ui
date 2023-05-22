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
          >挂起
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
  <!-- Form -->
  <el-button text @click="dialogFormVisible = true">
    open a Form nested Dialog
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="Shipping address">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai"/>
          <el-option label="Zone No.2" value="beijing"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {addObj, fetchList, putObj} from '@/api/workflow/process'
import {tableOption} from '@/const/crud/workflow/process'
import {mapGetters} from 'vuex'

export default {
  name: 'process',
  data() {
    return {
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      postProps: {
        label: 'postName',
        value: 'id'
      },
      roleProps: {
        label: 'roleName',
        value: 'id'
      },
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false //是否倒序
      },
      query: {},
      list: [],
      listLoading: true,
      post: [],
      role: [],
      form: {},
      postOptions: [],
      rolesOptions: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '140px',

      gridData: [
        {
          date: '2016-05-02',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District',
        },
        {
          date: '2016-05-04',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District',
        },
        {
          date: '2016-05-01',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District',
        },
        {
          date: '2016-05-03',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District',
        }
      ]
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
      alert("挂起")


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
      alert("删除")
    },
    exportExcel() {
      this.downBlobFile('/admin/user/export', this.query, 'user.xlsx')
    }
  }
}
</script>
