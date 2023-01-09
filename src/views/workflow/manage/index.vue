

<template>
  <div class="user">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
        v-model:page="page"
        :option="option"
        :table-loading="listLoading"
        :before-open="handleOpenBefore"
        :data="list"
        @on-load="getList"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-change="handleFilter"
        @refresh-change="handleRefreshChange"
        @row-update="update"
        @row-save="create"
      >
        <template #menu-left="{}">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="$refs.crud.rowAdd()"
          >添加
          </el-button>
        </template>
        <template #userName="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
        <template #role="scope">
          <span v-for="(r, index) in scope.row.roleList" :key="index">
            <el-tag>{{ r.roleName }} </el-tag>&nbsp;&nbsp;
          </span>
        </template>
        <template #post="scope">
          <span v-for="(p, index) in scope.row.postList" :key="index">
            <el-tag>{{ p.postName }} </el-tag>&nbsp;&nbsp;
          </span>
        </template>
        <template #deptName="scope">
          {{ scope.row.deptName }}
        </template>
        <template #lockFlag="scope">
          <dict-tag :options="scope.dic" :value="scope.row.lockFlag" />
        </template>
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
            v-if="permissions.sys_user_del"
            text
            type="primary"
            icon="el-icon-delete"
            @click="deletes(scope.row, scope.index)"
          >删除
          </el-button>
        </template>
        <template #deptId-form>
          <avue-input-tree
            v-model="form.deptId"
            placeholder="请选择所属部门"
            :node-click="getNodeData"
            :dic="treeDeptData"
            :props="defaultProps"
          ></avue-input-tree>
        </template>
        <template #role-form>
          <avue-select
            v-model="role"
            multiple
            placeholder="请选择角色"
            :dic="rolesOptions"
            :props="roleProps"
          ></avue-select>
        </template>
        <template #post-form>
          <avue-select
            v-model="post"
            multiple
            placeholder="请选择岗位"
            :dic="postOptions"
            :props="postProps"
          ></avue-select>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/admin/user'
import { deptRoleList } from '@/api/admin/role'
import { listPosts } from '@/api/admin/post'
import { fetchTree } from '@/api/admin/dept'
import { tableOption } from '@/const/crud/admin/user'
import { mapGetters } from 'vuex'

export default {
  name: 'work_flow',
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
      rolesOptions: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    role() {
      this.form.role = this.role
    },
    post() {
      this.form.post = this.post
    }
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
    getNodeData(data) {
      deptRoleList().then(response => {
        this.rolesOptions = response.data.data
      })
      listPosts().then(response => {
        this.postOptions = response.data.data
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
    handleOpenBefore(show, type) {
      window.boxType = type
      // 查询部门树
      fetchTree().then(response => {
        this.treeDeptData = response.data.data
      })
      // 查询角色列表
      deptRoleList().then(response => {
        this.rolesOptions = response.data.data
      })
      //查询岗位列表
      listPosts().then(response => {
        this.postOptions = response.data.data
      })
      // 若是编辑、查看回显角色名称
      if (['edit', 'views'].includes(type)) {
        this.role = []
        for (let i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].id
        }
        this.post = []
        for (let i = 0; i < this.form.postList.length; i++) {
          this.post[i] = this.form.postList[i].id
        }
      } else if (type === 'add') {
        // 若是添加角色列表设置为空
        this.role = []
        this.post = []
      }
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
      this.form.password = undefined
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
        delObj(row.userId)
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
