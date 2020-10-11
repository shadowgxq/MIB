<template>
  <div class="editUser">
    <el-dialog
    title="修改用户信息"
    :visible.sync= "editDialogVisible"
    width="50%"
    @close="editDialogClosed">
      <el-form
        :model="editUserForm"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="70px">
         <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {showEditDialog, editUserInfo} from 'network/user'
export default {
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      editUserForm: {},
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    editDialogClosed() {
      this.close()
    },
    edit(id) {
      showEditDialog(id).then(
        res => {
          const status = res.meta.status
          const msg = res.meta.msg
          if(status!==200) return this.$message.error(msg)
          this.editUserForm = res.data
          this.$message.success(msg)
        }
      )
    },
    close() {
      this.$emit('close')
    },
    editUser() {
      this.$refs.editUserFormRef.validate( valid => {
        if (!valid) return
        editUserInfo(this.editUserForm.id,{
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        }).then( res => {
          const status = res.meta.status
          const msg = res.meta.msg
          if(status!==200) return this.$message.error(msg)
          this.$message.success(msg)
          this.close()
        })
      })
    }
  }
}
</script>