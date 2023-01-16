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
      >
        <template #menu="scope">
          <el-button
            text
            type="primary"
            icon="el-icon-edit"
            @click="openLayer(scope.row, scope.index)"
          >审批
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>


  <el-dialog v-model="dialogFormVisible" title="Shipping address">
    <el-form :model="approveForm">
      <el-form-item label="是否同意">
        <el-select v-model="approveForm.approveStatus" placeholder="请选择">
          <el-option label="同意" value="1" aria-selected="true"/>
          <el-option label="拒绝" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="审批意见">
        <el-input v-model="approveForm.remark" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handle">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {fetchList, approve} from '@/api/todo/todoitem'
import {tableOption} from '@/const/crud/todo/todoitem'
import {mapGetters} from 'vuex'

export default {
  name: 'history_model',
  data() {
    return {
      option: tableOption,
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
      dialogFormVisible: false,
      approveForm: {
        id: null
      }
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
    handle() {
      console.log(this.approveForm)
      approve(this.approveForm)
        .then(() => {
          this.getList(this.page)
          this.$notify.success('审批成功')
          this.dialogFormVisible = false
        })
        .catch(() => {
        })
    },
    openLayer(row, index) {
      this.approveForm.id = row.id;
      this.dialogFormVisible = true;
    }
  }
}
</script>
