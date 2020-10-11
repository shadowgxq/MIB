<template>
  <div class="addUser">
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        :model="addUserForm"
        ref="addUserFormRef"
        :rules="addUserFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
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
import { addUseFrom} from "network/user.js";
export default {
  props: {
    addDialogVisible:{
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号码"));
    };
    return {
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名的长度在2～10个字",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "用户密码的长度在6～18个字",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
    };
  },
  methods: {
    closeDialog() {
      this.close()
      this.$refs.addUserFormRef.resetFields();
    },
    editUser() {
      this.$refs.addUserFormRef.validate((vaild) => {
        if (!vaild) return;
        addUseFrom(this.addUserForm).then((res) => {
          let stauts = res.meta.status;
          if (stauts !== 201) return this.$message.error(res.meta.msg);
          this.close()
        });
      });
    },
    close() {
     this.$emit('close')
    }
  },
};
</script>
