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
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addUser"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <el-table border stripe :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            circle
            @click="showEditDialog(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            @click="removeUserById(scope.row.id)"
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
          </template>
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
        :total="total"
      >
      </el-pagination>
    </el-card>
    <add-user :addDialogVisible="addDialogVisible"
    @close= "close"></add-user>
    <edit-user :editDialogVisible="editDialogVisible" ref="editUser"
    @close= "close"></edit-user>
  </div>
</template>
<script>
import AddUser from 'components/AddUser.vue'
import EditUser from 'components/EditUser.vue'

import { getUserList, userStateChanged,removeUserById} from "network/user.js";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 5,
      addDialogVisible: false,
      editDialogVisible: false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    back() {
      window.sessionStorage.setItem("activePath", "");
    },
    async getUserList() {
      const data = await getUserList(this.queryInfo);
      this.tableData = data.data.users;
      this.total = data.data.total;
    },
    async userStateChanged(userInfo) {
      const res = await userStateChanged(userInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      return this.$message.success(res.meta.msg);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
      this.getUserList();
    },
    addUser() {
      this.addDialogVisible = true
    },
    close() {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.getUserList();

    },
    showEditDialog(id) {
      this.editDialogVisible = true
      this.$refs.editUser.edit(id)
    },
     async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      removeUserById(id).then( res=> {
        if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
        this.$message.success('删除用户成功！')
        this.getUserList()
      })
    }
  },
  components: {
    AddUser,
    EditUser
  },
 
};
</script>
<style lang="less" scoped>
</style>