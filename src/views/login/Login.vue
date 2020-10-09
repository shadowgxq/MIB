<template>
  <div id="login">
    <div class="container">
      <div class="logo">
        <img src="~assets/images/logo.png" alt="">
      </div>
      <div class="form">
        <el-form
          ref="loginFormRef"
          label-width="0px"
          :model="loginForm"
          :rules="loginFormRules"
        >
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {login} from 'network/login.js'
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { require: true, message: '请输入用户名', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return false
        login(this.loginForm).then(res => {
          const {status} = res.meta
          if (status !== 200){
            this.reset()
            return this.$message.error('用户名或密码错误')
          } 
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })
      })
    },
    reset() {
      this.$refs.loginFormRef.resetFields()
    }
  }
};
</script>
<style lang="less" scoped>
#login{
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .container{
    width: 450px;
    height: 360px;
    border-radius: 3px;
    background-color: #fff;
    position: relative;
   
    .logo{
      z-index: 2;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      border: 10px solid #fff;
      padding: 10px;
      position: absolute;
      left: calc(~"225px - 75px");
      top: -85px;
      box-shadow: 0 0 10px #ddd;
      background-color: #eee;
      img{
        width: 130px;
        height: 130px;
      }
    }
    .form{
      padding: 0 15px;
      margin-top: 30%;
    }
    .button{
      float: right;
      margin-right: 15px;
    }
  }
}
</style>