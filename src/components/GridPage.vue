<template>
  <com />
</template>

<script setup lang="tsx">
import { toRaw, reactive, ref } from "vue";
import AppSearchForm from "./AppSearchForm.vue";

interface Props {
  formOptions?: Record<string, any>;
  gridOptions?: Record<string, any>;
  pageOptions?: Record<string, any>;
  customOptions?: Record<string, any>;
}

const {
  formOptions,
  gridOptions,
  pageOptions,
  customOptions = {}
} = defineProps<Props>();

const vxeGrid: any = ref(null);
const gridProps = reactive({
  height: "auto",
  align: "center",
  autoResize: true
});
const pageProps = reactive({
  background: true,
  layout: "->, total, sizes, prev, pager, next"
});
const customProps = reactive({
  ["element-loading-text"]: "加载中..."
});

const handleCurrentChange = () => {
  customOptions?.onSearch();
};
const handleSizeChange = () => {
  // eslint-disable-next-line vue/no-mutating-props
  pageOptions && (pageOptions.currentPage = 1);
  customOptions?.onSearch();
};
const checkboxChange = (item: any) => {
  const { checkboxChange }: any = gridOptions;
  typeof checkboxChange === "function" && checkboxChange(item);
};
const checkboxAll = (item: any) => {
  const { checkboxAll }: any = gridOptions;
  typeof checkboxAll === "function" && checkboxAll(item);
};
const cellClick = (item: any) => {
  vxeGrid.value?.setRadioRow(item.row);
};

defineExpose({
  vxeGrid
});

const com = () => (
  <div
    class="grid-page"
    v-loading={customOptions.loading}
    {...customProps}
    {...customOptions}
  >
    {formOptions && (
      <AppSearchForm {...formOptions} vSlots={toRaw(formOptions?.slots)} />
    )}
    <div class={["grid-page-table", pageOptions ? "table-mb" : ""]}>
      <vxe-grid
        ref={vxeGrid}
        {...gridProps}
        {...gridOptions}
        onCheckboxChange={checkboxChange}
        onCheckboxAll={checkboxAll}
        onCellClick={cellClick}
      />
    </div>
    {pageOptions && (
      <el-pagination
        vModel={[pageOptions.currentPage, "currentPage"]}
        vModel={[pageOptions.pageSize, "pageSize"]}
        {...pageProps}
        {...pageOptions}
        onCurrentChange={handleCurrentChange}
        onSizeChange={handleSizeChange}
      />
    )}
  </div>
);
</script>

<style lang="scss" scoped>
.grid-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep() {
    .grid-page-table {
      flex: 1;
      height: 300px;
      overflow: hidden;
    }
    .table-mb {
      margin-bottom: 16px;
    }
  }
}
</style>
