<template>
  <com />
</template>

<script setup lang="tsx">
import api from "@/api/project";
import DetailDialog from "./detailDialog.vue";
import GridPage from "@/components/GridPage.vue";
import { ref, reactive } from "vue";
import { VxeColumnSlotTypes } from "vxe-table";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const dialogRef = ref();
const formOptions = reactive({
  isRow: true,
  confObj: {
    project: {
      name: "项目名称",
      prop: "project",
      offset: 6,
      type: "select",
      label: "name",
      value: "id",
      filterable: true,
      options: []
    },
    name: {
      name: "创建人",
      prop: "name",
      offset: 6,
      type: "input"
    }
  },
  searchBtnConfig: {
    confirm: true,
    offset: 5
  },
  formData: {
    project: null,
    name: ""
  },
  slots: {
    default: () => (
      <el-button icon={Plus} type="primary" onClick={() => handleDetail(null)}>
        新增
      </el-button>
    )
  },
  clickSearch() {
    pageOptions.currentPage = 1;
    customOptions.onSearch();
  }
});
const gridOptions = reactive({
  showOverflow: true,
  columns: [
    { field: "id", title: "ID" },
    { field: "项目名称", title: "项目名称" },
    { field: "项目ID", title: "项目ID" },
    { field: "项目描述", title: "项目描述" },
    { field: "项目状态", title: "项目状态" },
    { field: "创建人", title: "创建人" },
    { field: "创建时间", title: "创建时间" },
    { field: "修改人", title: "修改人" },
    { field: "修改时间", title: "修改时间" },
    {
      title: "操作",
      width: 190,
      slots: {
        default({ row }: VxeColumnSlotTypes.EditSlotParams) {
          return (
            <>
              <el-button size="small" onClick={() => handleDetail(row)}>
                编辑
              </el-button>
              <el-button type="danger" size="small" onClick={() => del(row)}>
                删除
              </el-button>
              <el-button
                type="danger"
                size="small"
                onClick={() => offLine(row)}
              >
                下线
              </el-button>
            </>
          );
        }
      }
    }
  ],
  data: []
});
const pageOptions = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const customOptions = reactive({
  loading: false,
  onSearch: async () => {
    customOptions.loading = true;
    const { status, data } = await api.getList({
      ...formOptions.formData,
      pageNum: pageOptions.currentPage,
      pageSize: pageOptions.pageSize
    });

    customOptions.loading = false;
    if (status !== "1") return;
    pageOptions.total = data.total;
    gridOptions.data = data.rows;
  }
});

const del = ({ id }: Record<string, any>) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const { status } = await api.deleteProject({ id });
      if (status !== "1") return;
      formOptions.clickSearch();
      ElMessage.success("操作成功");
    })
    .catch(() => {});
};
const offLine = ({ id }: Record<string, any>) => {
  ElMessageBox.confirm("确定要下线吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const { status } = await api.offLineProject({ id });
      if (status !== "1") return;
      formOptions.clickSearch();
      ElMessage.success("操作成功");
    })
    .catch(() => {});
};

const handleDetail = (row?: Record<string, any> | null) => {
  dialogRef.value.init(row);
};

const init = async () => {
  customOptions.onSearch();
  // const { status, data } = await api.getAllFolderList();

  // if (status !== "1") return;
  // formOptions.confObj.groupId.options = data;
};

init();

const com = () => (
  <section class="component-wrap">
    <div class="main">
      <GridPage
        formOptions={formOptions}
        gridOptions={gridOptions}
        pageOptions={pageOptions}
        customOptions={customOptions}
      />
    </div>
    <DetailDialog
      ref={dialogRef}
      onSearch={() => {
        formOptions.clickSearch();
      }}
    />
  </section>
);
</script>

<style lang="scss" scoped>
.component-wrap {
  margin: 16px;
  background-color: white;
  height: calc(100vh - 32px - 82px);
  :deep() {
    .main {
      height: 100%;
      padding: 16px;
      overflow: auto;
    }
  }
}
</style>
