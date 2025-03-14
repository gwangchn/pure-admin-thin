<template>
  <com />
</template>

<script setup lang="tsx">
import api from "@/api/project";
import AppForm from "@/components/AppForm.vue";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

const defualtForm = () =>
  reactive({
    name: "",
    description: ""
  });
const formRef = ref();
const state = reactive({
  isEdit: false,
  visible: false,
  title: "",
  id: null
});
const formOptions = reactive({
  confList: [
    {
      type: "input",
      prop: "name",
      name: "项目名称"
    },
    {
      type: "input",
      prop: "description",
      name: "项目描述",
      componentOptions: {
        type: "textarea",
        rows: 4
      }
    }
  ],
  formData: defualtForm(),
  ruleForm: {
    name: [
      {
        required: true,
        message: "请输入文件夹名",
        trigger: ["change", "blur"]
      }
    ],
    description: [
      {
        required: true,
        message: "请输入项目描述",
        trigger: ["change", "blur"]
      }
    ]
  }
});
const emit = defineEmits(["search"]);

const init = async (row: Record<string, any>) => {
  state.visible = true;
  state.isEdit = !!row;
  state.title = state.isEdit ? "编辑项目" : "新增项目";
  if (row) initState(row);
};

const initState = (row: Record<string, any>) => {
  const { name, description } = row;
  formOptions.formData = {
    name,
    description
  };
  state.id = row.id;
};

const onClose = () => {
  formOptions.formData = defualtForm();
  formRef.value?.resetFields();
};

const confirm = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  const { formData }: any = formOptions;
  const { status } = state.isEdit
    ? await api.editProject({
        description: formData.description,
        name: formData.name,
        id: state.id
      })
    : await api.addProject({
        ...formData
      });
  if (status !== "1") return;
  ElMessage.success("操作成功");
  emit("search");
  state.visible = false;
};

defineExpose({
  init
});

const com = () => {
  const { title } = state;
  return (
    <el-dialog
      v-model={state.visible}
      {...{ title, width: "800px", onClose }}
      v-slots={{
        footer: () => (
          <>
            <el-button
              onClick={() => {
                state.visible = false;
              }}
            >
              取消
            </el-button>
            <el-button type="primary" onClick={confirm}>
              确定
            </el-button>
          </>
        )
      }}
    >
      <AppForm ref={formRef} {...formOptions} />
    </el-dialog>
  );
};
</script>
