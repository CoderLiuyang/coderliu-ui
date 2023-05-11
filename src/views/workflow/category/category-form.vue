<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    append-to-body
    :close-on-click-modal="false"
    @close="closeDialog()"
    v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="id" prop="id" v-if="dataForm.id">
        <el-input v-model="dataForm.id" placeholder="id" disabled></el-input>
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="dataForm.categoryName" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入分类编码" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="canSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {getObj, addObj, putObj} from '@/api/workflow/category'

export default {
  data() {
    return {
      visible: false,
      canSubmit: false,
      dataForm: {
        id: null,
        categoryName:undefined,
        code:undefined,
        remark:undefined
      },
      dataRule: {
        categoryName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "分类编码不能为空", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.visible = true;
      this.canSubmit = true;
      this.dataForm.id = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          getObj(id).then(response => {
            this.dataForm = response.data.data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.canSubmit = false;
          if (this.dataForm.id) {
            putObj(this.dataForm).then(data => {
              this.$notify.success('修改成功')
              this.visible = false
              this.$emit('refreshDataList')
            }).catch(() => {
              this.canSubmit = true;
            });
          } else {
            addObj(this.dataForm).then(data => {
              this.$notify.success('添加成功')
              this.visible = false
              this.$emit('refreshDataList')
            }).catch(() => {
              this.canSubmit = true;
            });
          }
        }
      })
    },
    //重置表单
    closeDialog() {
      this.$refs["dataForm"].resetFields()
    }
  }
}
</script>
