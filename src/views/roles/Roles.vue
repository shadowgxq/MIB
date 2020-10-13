<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-button type="primary" @click="AddRoleDialogVisible = true">添加角色</el-button>
    <el-table :data="rolesList" stripe style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
          :class="['bdbottom', i1 === 0 ? 'bdtop':'', 'vcenter']">
            <el-col :span="5"
            >
              <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
              :class="[i2 === 0 ? '' : 'bdtop', 'vcenter','top']">
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag 
                  type="warning"
                  v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                    {{ item3.authName}}
                  </el-tag>
                </el-col> 
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column label="操作"> 
        <template slot-scope="scope">
            <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUserById(scope.row.id)"
          >删除</el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showSetRightDialog(scope.row)"
          >分配权限</el-button>
          </template>
      </el-table-column>
    </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys">
     </el-tree>
     <span slot="footer" class="dialog-footer">
       <el-button @click="setRightDialogVisible = false">取消</el-button>
       <el-button @click="allotRights">确定</el-button>
     </span>
    </el-dialog>
    

  </div>
</template>
<script>
import { getRolesList, getRightsTree,removeRight,
deleteRole, 
showEditDialog,showSetRightDialog,
editRoles, addRoles, allotRights } from "network/roles";
export default {
  data() {
    return {
      rolesList: [],
      rightTree: [],
      AddRoleDialogVisible: false,
      addRoleForm: {},
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editRoleForm: {},
      editRoleDialogVisible:false,
      editRoleFormRules: {
        roleName:[
          {require: true, message: '请输入角色名称', tigger: 'blur'}
        ],
        roleDesc: [
           {require: true, message: '请输入角色描述', tigger: 'blur'}
        ]
      },
      roleId: 0,
      rightList: [],
      setRightDialogVisible: false,
      defKeys: [],
      treeProps:{
        label: 'authName',
        children: 'children'
      }

    }
  },
  methods: {
    getRolesList() {
      getRolesList().then((res) => {
        this.rolesList = res.data;
      });
    },
    getRightsTree() {
      getRightsTree().then((res) => {
        this.rightTree = res.data;
      });
    },
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
       return  this.$message.info('已取消权限删除')
      }
      removeRight(role, id).then(res => {
        if(res.meta.status!== 200) {
          return this.$message.error('删除权限失败！')
        }
        this.getRolesList() 
      })
    },
    showEditDialog (id) {
      showEditDialog(id).then(res => {
        if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
        this.editRoleForm = res.data
        this.editRoleDialogVisible = true
      })
      
    },
    async removeUserById(id) {
      const confirmResult =  await this.$confirm(
        '此操作将永久删除该角色，是否继续?',
        '提示',
        {
          confirmButtonText:'确定',
          cancelButtonText: '取消',
          type:'warning'
        }
      )
      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消删除')
      }
      
      deleteRole(id).then( res => {
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除用户成功！')
      this.getRolesList()
      })
      
    },
    addRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
      this.$refs.addRoleFormRef.resetFields()
    },
    editRoles() {
      this.$refs.editRoleFormRef.validate((valid) => {
          if (!valid) {return} 
          editRoles(this.editRoleForm.roleId, {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }).then(res => {
            if (res.meta.status !== 200) {
              this.$message.error('更新角色信息失败！')
            }
            this.editRoleDialogVisible = false
            this.$message.success('更新角色信息成功！')
            this.getRolesList()
            });
          })
    },
    addRoles () {
      this.$refs.addRoleFormRef.validate( valid => {
        if (!valid) return
        addRoles(this.addRoleForm).then(res => {
          if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          this.AddRoleDialogVisible = false
          this.getRolesList()
          })
        
      })
    },
    showSetRightDialog(role) {
      console.log(role);
      this.roleId = role.id
      showSetRightDialog().then(res => {
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightList = res.data
      })
      this.setRightDialogVisible = true
      this.getLeafkeys(role,this.defKeys)
    },
    getLeafkeys(node, arr) {
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach( item => {
        this.getLeafkeys(item,arr)
      })
    },
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const roelId = this.roleId
      allotRights(roelId,{rids: idStr}).then(res => {
        if (res.meta.status !== 200) { return this.$message.error('分配权限失败！') }
        this.$message.success('分配权限成功!')
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    },
    setRightDialogClosed() {
      this.rolesList = []
    }
    
  },
  created() {
    this.getRolesList();
    this.getRightsTree();
  },
};
</script>
<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee
}
.vcenter {
  display: flex;
  align-items: center;
}
.top{
  margin-top: -1px;
}
</style>