<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="permissions.workflow_category_add" icon="el-icon-plus" type="primary"
                     @click="addOrUpdateHandle()">新增
          </el-button>
        </el-form-item>
      </el-form>

      <div class="avue-crud">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading">

          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="分类编号">
          </el-table-column>

          <el-table-column
            prop="categoryName"
            header-align="center"
            align="center"
            label="分类名称">
          </el-table-column>
          <el-table-column
            prop="code"
            header-align="center"
            align="center"
            label="分类编码">
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="操作">
            <template #="scope">
              <el-button v-if="permissions.workflow_category_edit"  text
                         type="primary"  icon="el-icon-edit"
                         @click="addOrUpdateHandle(scope.row.id)">修改
              </el-button>
              <el-button v-if="permissions.workflow_category_del" text type="primary" size="small" icon="el-icon-delete"
                         @click="deleteHandle(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          background
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></table-form>
    </basic-container>
  </div>
</template>

<script>
import {fetchList, delObj} from '@/api/workflow/category'
import TableForm from './category-form.vue'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    TableForm
  },
  created() {
    this.getDataList()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      fetchList(Object.assign({
        current: this.pageIndex,
        size: this.pageSize
      })).then(response => {
        this.dataList = response.data.data.records
        this.totalPage = response.data.data.total
      })
      this.dataListLoading = false
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$refs.addOrUpdate.init(id)
    },
    // 删除
    deleteHandle(id) {
      this.$confirm('是否确认删除ID为' + id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(id)
      }).then(data => {
        this.$message.success('删除成功')
        this.getDataList()
      }).catch(() => {
      })
    }
  }
}
</script>
