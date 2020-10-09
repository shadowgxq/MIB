<template>
  <div id="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }" @click.native="back()"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7"
          ><el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
          ></el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>
      <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="180">
      </el-table-column>
      <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
              <el-table-column label="操作">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="角色分配"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                circle
              ></el-button>
            </el-tooltip>
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 5, 10, 20]"
      :page-size="5"
      small
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
import {getUserList, userStateChanged} from 'network/user.js'
export default {

  data() {
    return{
      tableData: [],
      currentPage:1,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5 
      },
      total: 5
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    back() {
      window.sessionStorage.setItem("activePath", "");
    },
    async getUserList() {
      const data = await getUserList(this.queryInfo)
      this.tableData = data.data.users
      this.total = data.data.total
    },
    async userStateChanged(userInfo) {
      const res = await userStateChanged(userInfo)
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      return this.$message.success(res.meta.msg)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    } 
    
  },
};
</script>
<style lang="less" scoped>
</style>