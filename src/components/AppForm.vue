<template>
  <com />
</template>

<script setup lang="tsx">
import { ref, useSlots } from "vue";

interface Props {
  confList?: Array<Record<string, any>>;
  formData?: Record<string, any>;
  ruleForm?: Record<string, any>;
  labelWidth?: string | number;
  labelPosition?: "left" | "right" | "top";
  onValueChange?: (D: Record<string, any>) => void;
}

const props = withDefaults(defineProps<Props>(), {
  confList: () => [],
  formData: () => ({}),
  ruleForm: () => ({}),
  labelWidth: "120px",
  labelPosition: "right",
  onValueChange: () => ({})
});
const emit = defineEmits(["onValueChange"]);
const { onValueChange } = props;
const slots: Record<string, any> = useSlots();

const appFormRef = ref();

const valueChange = (value: any, type: string, key: string) => {
  onValueChange({ value, type, key });
  emit("onValueChange");
};
const resetFields = () => {
  appFormRef.value.resetFields();
};
const validate = () => appFormRef.value.validate((valid: boolean) => valid);

defineExpose({
  validate,
  resetFields
});

const com = () => {
  const { formData, ruleForm, labelWidth, labelPosition } = props;

  return (
    <el-form
      ref={appFormRef}
      model={formData}
      rules={ruleForm}
      label-width={labelWidth}
      label-position={labelPosition}
    >
      <el-row gutter={8}>
        {props.confList?.map(item => (
          <el-col span={item.offset ?? 24}>
            {item.type === "layout" ? (
              <>
                {
                  // template写法
                  typeof item.slot === "string" && slots[item.slot]()
                }
                {
                  // tsx写法
                  typeof item.slot === "function" && item?.slot()
                }
              </>
            ) : (
              <el-form-item
                label={item.name}
                prop={item.prop ?? ""}
                required={item.required}
                label-width={item.labelWidth}
              >
                {item.type === "input" && (
                  <el-input
                    v-model={[formData[item.prop]]}
                    disabled={item.disabled}
                    placeholder={item.placeholder ?? "请输入"}
                    onChange={() =>
                      valueChange(formData[item.prop], item.type, item.prop)
                    }
                    {...item.componentOptions}
                  />
                )}

                {item.type === "radio" && (
                  <el-radio-group
                    v-model={formData[item.prop]}
                    disabled={item.disabled}
                    onChange={() =>
                      valueChange(formData[item.prop], item.type, item.prop)
                    }
                    {...item.componentOptions}
                  >
                    {item?.options?.map((option: any) => (
                      <el-radio value={option.value}>{option.label}</el-radio>
                    ))}
                  </el-radio-group>
                )}

                {item.type === "select" && (
                  <el-select
                    v-model={formData[item.prop]}
                    disabled={item.disabled}
                    clearable={item.clearable ?? false}
                    placeholder={item.placeholder ?? "请选择"}
                    onChange={() =>
                      valueChange(formData[item.prop], item.type, item.prop)
                    }
                    {...item.componentOptions}
                  >
                    {item?.options?.map((option: Record<string, any>) => (
                      <el-option
                        disabled={item.disabled}
                        label={option[item.label] ?? option.label}
                        value={option[item.value] ?? option.value}
                      />
                    ))}
                  </el-select>
                )}

                {item.type === "treeSelect" && (
                  <el-tree-select
                    v-model={formData[item.prop]}
                    data={item.options ?? []}
                    disabled={item.disabled}
                    filterable={item.filterable}
                    check-strictly={item.checkStrictly}
                    onChange={() =>
                      valueChange(formData[item.prop], item.type, item.prop)
                    }
                    {...item.componentOptions}
                  />
                )}

                {item.type === "checkbox" && (
                  <el-checkbox-group
                    v-model={formData[item.prop]}
                    disabled={item.disabled}
                    onChange={() =>
                      valueChange(formData[item.prop], item.type, item.prop)
                    }
                    {...item.componentOptions}
                  >
                    {item?.options?.map((option: any) => (
                      <el-checkbox value={option.value}>
                        {option.label}
                      </el-checkbox>
                    ))}
                  </el-checkbox-group>
                )}

                {
                  // template写法
                  item.type === "custom" &&
                    typeof item.slot === "string" &&
                    slots[item.slot]()
                }
                {
                  // tsx写法
                  item.type === "custom" &&
                    typeof item.slot === "function" &&
                    item?.slot()
                }
              </el-form-item>
            )}
          </el-col>
        ))}
      </el-row>
    </el-form>
  );
};
</script>
