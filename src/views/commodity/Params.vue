<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>

      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态属性" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="!isBtnDisabled"
            @click="addProps"
            >添加属性</el-button
          >
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleCloseTag(i, scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="!isBtnDisabled"
            @click="addProps"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleCloseTag(i, scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedCateKeys: [],
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addFrom: {
        attr_name: "",
      },
      addFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editFrom: {
        attr_name: "",
        attr_id: "",
      },
      editFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      }
    };
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length === 3) {
        return true;
      }
      return false;
    },
    getCateId() {
      if (this.isBtnDisabled) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    dialogTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态参数";
      }
    },
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.cateList = res.data;
    },
    handleChange() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    handleClick() {
      this.getParamsData();
    },
    addProps() {
      this.addDialogVisible = true;
    },
    addParams() {
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName,
          }
        );
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败！");
        }
        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    handleClose() {
      this.$refs.addFromRef.resetFields();
      this.addDialogVisible = false;
    },
    editDialogClosed() {
      this.$refs.editFromRef.resetFields();
      this.addDialogVisible = false;
    },
    editParams() {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败！");
        }
        this.$message.success("修改参数成功！");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类失败！");
      }
      this.editFrom = res.data;
      this.editDialogVisible = true;
    },
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除此分类，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除!");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败！");
      }
      this.$message.success("删除参数成功！");
      this.getParamsData();
    },
    showInput(row) {
        row.inputVisible = true
        this.$nextTick( () => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return 
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    handleCloseTag (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  created() {
    this.getCateList();
  },
};
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
.input-new-tag{
  width: 62px;
  margin: 0 10px;
}
.el-tag {
  margin: 0 10px;
}
</style>