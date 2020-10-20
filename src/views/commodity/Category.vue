<template>
  <div class="category">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

  <el-card>
    <el-row>
      <el-button type="primary" @click="addCategory">添加分类</el-button>
    </el-row>
    <tree-table
      class="tree-table"
      index-text="#"
      :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      :show-row-hover="false"
      show-index
      border
      >
      <template slot="isOk" slot-scope="scope">
        <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" v-else></i>
      </template>
      <template slot="sort" slot-scope="scope">
        <el-tag type="success" v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
        <el-tag type="info" v-else-if="scope.row.cat_level===1" size="mini">二级</el-tag>
        <el-tag type="warning" v-else size="mini">三级</el-tag>
      </template>
      <template slot="operate" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEditCate(scope.row.cat_id)">删除</el-button>
      </template>
    </tree-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1,5,10,20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>

  <el-dialog
  title="添加分类"
  :visible.sync="AddDialogVisible"
  width="50%"
  @close="addCateDialogClosed">
  
  <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类">
      <el-cascader
      v-model="selectedKeys"
      :options="parentCateList"
      :props="cascaderProps"
      @change="handleChange"
      clearable
      :change-on-select="true"></el-cascader>
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="AddDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>

  <el-dialog
  title="编辑分类"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed">
  
  <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="editForm.cat_name"></el-input>
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
        label: '分类名称',
        prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        },
      ],
      AddDialogVisible: false,
      addCateRules:{
        cat_name:[
           { required: true, message: '名称不能为空', trigger: 'blur' },
        ]
      },
      editRules:{
        cat_name:[
           { required: true, message: '名称不能为空', trigger: 'blur' },
        ]
      },
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedKeys: [],
      editDialogVisible: false,
      editForm: ''
    }
  },
  methods: {
    async getCateList() {
      const{data: res} = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if(res.meta.status !== 200) return this.$messsage.error('获取商品分类失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getCateList()
    },
    addCategory() {
      this.AddDialogVisible = true
      this.getParentCateList()
    },
    addCateDialogClosed() {
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！')
      }
      this.parentCateList = res.data
    },
    handleChange() {
     if(this.selectedKeys.length > 0) {
       this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
       this.addCateForm.cat_level = this.selectedKeys.length
       return 0
     }else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
     }
    },
    addCate() {
        this.$refs.addCateRef.validate( async valid => {
        if(!valid) return 
        const {data: res} = await this.$http.post('categories',this.addCateForm)
        if(res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.AddDialogVisible = false
      })
    },
    editDialogClosed() {
      this.$refs.editRef.resetFields()
    },
    async showEditCateDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    edit() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id,
          {
            cat_name: this.editForm.cat_name
          })
        if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
        this.$message.success('更新分类名成功！')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    async deleteEditCate(id) {
      const confirmResult = await this.$confirm('此操作将永久删除此分类，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch( err => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const {data: res} = await this.$http.delete('categories/'+ id)
      if (res.meta.status !== 200) { return this.$message.error('删除商品分类失败！') }
      this.$message.success('删除商品分类成功！')
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
};
</script>
<style lang="less" scoped>
.tree-table{
  margin-top: 20px;
}
.el-cascader{
  width: 100%;
}
</style>