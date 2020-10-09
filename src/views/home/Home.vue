<template>
  <div id="home">
    <el-container>
      <el-header>
        <div class="logo">
          <div><img src="~assets/images/logo.png" alt="" /></div>
          <div>电商后台管理系统</div>
        </div>
        <div class="button">
          <el-button type="info" @click="logout()">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="togleCollapse">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409FFF"
            :unique-opened="true"
            :default-active="activePath" 
            :collapse="isCollapse"
            :collapse-transition= "false"
            router
          >
            <el-submenu v-for="item in MenuList" :key="item.id" :index="item.id+''">
              <template slot="title">
                <i style="margin-right:10px" :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item 
              v-for="item1 in item.children" :key="item1.id"
              :index="'/' + item1.path" 
              @click="saveNavState('/'+item1.path)"
              >
                <i class="el-icon-menu"></i>
                {{item1.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {getMenuList} from 'network/home.js'

export default {
  name: "Home",
  data() {
    return {
      MenuList: {},
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '',
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getMenuList() {
      getMenuList().then(res => {
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.MenuList = res.data
      })
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
    },
    togleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
};
</script>
<style lang="less" scoped>
#home {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #373f41;
    display: flex;
    justify-content: space-between;
    .logo {
      display: flex;
      align-items: center;
      img {
        height: 40px;
        margin-right: 10px;
      }
      font-size: 20px;
      color: #fff;
    }
    .button {
      line-height: 60px;
    }
  }
  .el-aside {
    background-color: #373f41;
    .toggle-button{
      color: #fff;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
    .el-menu {
    border: none;
  }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>