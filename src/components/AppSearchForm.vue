<!-- eslint-disable -->
<template>
  <div
    class="xdf-search-form"
    id="xdf-search-form"
    :class="{
      'xdf-search-form__row': isRow,
      'xdf-search-form__label': isShowLabel
    }"
  >
    <el-row :gutter="8">
      <!-- 表单 -->
      <el-form
        :size="size"
        ref="searchForm"
        :model="formData"
        :rules="ruleForm"
        class="clearfix search-form-box"
        :style="{
          position: 'relative',
          overflow: 'hidden',
          height: selectListHeight
            ? _searchBtnConfig.filterItem
              ? childHeight + 'px'
              : ''
            : ''
        }"
      >
        <el-col
          v-for="(item, key) in confObj"
          :key="key"
          :span="item.offset || 4"
          :class="item.className || ''"
        >
          <el-form-item :label="item.name" :prop="item.prop ? item.prop : ''">
            <!-- select选择组件 -->
            <el-select
              v-model="formData[key]"
              :clearable="item.clearable === false ? item.clearable : true"
              :filterable="item.filterable || false"
              :allow-create="item.allowCreate || false"
              :default-first-option="item.defaultFirstOption || false"
              v-if="item.type === 'select'"
              :placeholder="item.placeholder || '请选择'"
              :multiple="item.multiple || false"
              :disabled="item.disabled || false"
              v-bind="item.componentOptions ? item.componentOptions : {}"
              collapse-tags
              @change="valueChange(formData[key], item.type, key)"
              v-on="item.eventOption ? item.eventOption : {}"
            >
              <el-option
                v-for="(option, index) in item.options"
                :key="index"
                :disabled="option.disabled || false"
                :label="option[item.label] || option.label"
                :value="option[item.value] || option.value"
              ></el-option>
            </el-select>
            <!-- input输入框组件 -->
            <el-input
              v-if="item.type === 'input'"
              v-model.trim="formData[key]"
              :clearable="true"
              :placeholder="item.placeholder || '请输入'"
              v-bind="item.componentOptions ? item.componentOptions : {}"
              @change="valueChange(formData[key], item.type, key)"
              @keyup.enter.native="search"
            ></el-input>
            <!-- 日期组件 -->
            <el-date-picker
              v-if="item.type === 'datePicker'"
              v-model="formData[key]"
              style="width: 100%"
              :clearable="true"
              :placeholder="item.placeholder || '请选择日期'"
              :type="item.dateType || 'datetime'"
              :picker-options="item.pickerOptions"
              :format="item.format || 'YYYY-MM-DD'"
              :value-format="item.valueFormat || 'YYYY-MM-DD'"
              :range-separator="item.rangeSeparator || '至'"
              :start-placeholder="item.startPlaceholder || '开始日期'"
              :end-placeholder="item.endPlaceholder || '结束日期'"
              v-bind="item.componentOptions ? item.componentOptions : {}"
              @change="valueChange(formData[key], item.type, key)"
              v-on="item.eventOption ? item.eventOption : {}"
            ></el-date-picker>
            <!-- 日期组件范围 -->
            <el-date-picker
              v-if="item.type === 'datePickerRange'"
              v-model="formData[key]"
              :clearable="item.clearable === false ? item.clearable : true"
              :type="item.dateType || 'datetimerange'"
              :format="item.format || 'YYYY-MM-DD'"
              :value-format="item.valueFormat || 'YYYY-MM-DD'"
              :range-separator="item.rangeSeparator || '至'"
              :start-placeholder="item.startPlaceholder || '开始日期'"
              :end-placeholder="item.endPlaceholder || '结束日期'"
              v-bind="item.componentOptions ? item.componentOptions : {}"
              @change="valueChange(formData[key], item.type, key)"
              v-on="item.eventOption ? item.eventOption : {}"
            >
            </el-date-picker>
            <!-- 时间组件 -->
            <el-time-picker
              v-if="item.type === 'timePicker'"
              v-model="formData[key]"
              :clearable="true"
              :is-range="item.isRange || false"
              :picker-options="item.pickerOptions"
              :value-format="item.valueFormat"
              :format="item.format"
              :align="item.align"
              :popper-class="item.popperClass"
              :prefix-icon="item.prefixIcon"
              :disabled="item.disabled"
              :range-separator="item.rangeSeparator || '至'"
              :start-placeholder="item.startPlaceholder || '开始时间'"
              :end-placeholder="item.endPlaceholder || '结束时间'"
              @change="valueChange(formData[key], item.type, key)"
            ></el-time-picker>
            <!-- 树形选择组件 -->
            <el-tree-select
              v-if="item.type === 'treeSelect'"
              v-model="formData[key]"
              :data="item.options ?? []"
              :clearable="item.clearable === false ? item.clearable : true"
              :disabled="item.disabled || false"
              :filterable="item.filterable || false"
              :check-strictly="item.checkStrictly ?? false"
              :="item.componentOptions ? item.componentOptions : {}"
              @="item.eventOption ? item.eventOption : {}"
              @change="valueChange(formData[key], item.type, key)"
            />
            <slot :name="item.slot" :item="item"></slot>
          </el-form-item>
        </el-col>
        <!-- 操作按钮 -->
        <el-col
          v-if="!_searchBtnConfig.isRow && _searchBtnConfig.showBtn"
          :span="_searchBtnConfig.offset || 4"
        >
          <el-form-item
            label="按钮"
            :class="{ 'hidden-label__title': !_searchBtnConfig.isRow }"
          >
            <el-button
              v-if="_searchBtnConfig.confirm"
              :size="size"
              type="primary"
              @click="search"
              >查询</el-button
            >
            <el-button v-if="_searchBtnConfig.reset" :size="size" @click="Reset"
              >重置</el-button
            >
            <slot></slot>
          </el-form-item>
        </el-col>
        <!-- 其他内容 -->
        <slot name="otherSlot"></slot>
      </el-form>
      <!-- 操作按钮 -->
      <el-row
        v-if="_searchBtnConfig.isRow && _searchBtnConfig.showBtn"
        justify="end"
        class="xdf-search-btn"
      >
        <el-button
          v-if="_searchBtnConfig.confirm"
          :size="size"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          plain
          v-if="_searchBtnConfig.reset"
          :size="size"
          @click="Reset"
          >重置</el-button
        >
        <slot></slot>
        <el-button
          :size="size"
          v-if="_searchBtnConfig.filterItem"
          plain
          @click="retractClick"
          class="searchbtn--show"
          >{{ filterText }}
          <i
            :class="{
              'el-icon-arrow-up': !selectListHeight,
              'el-icon-arrow-down': selectListHeight
            }"
          ></i>
        </el-button>
      </el-row>
    </el-row>
  </div>
</template>

<script lang="js">
/* eslint-disable */
export default {
  name: "app-search-form",
  props: {
    confObj: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    ruleForm: {
      type: Object,
      default: () => ({}),
      required: false
    },
    searchBtnConfig: {
      type: Object,
      default: () => ({}),
      required: false
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    },
    isRow: {
      type: Boolean,
      default: false,
      required: false
    },
    isShowLabel: {
      type: Boolean,
      default: false,
      required: false
    },
    className: {
      type: String,
      default: "",
      required: false
    },
    size: {
      type: String,
      default: "default"
    },
    clickSearch: {
      type: Function,
      default: () => {}
    },
    clickReset: {
      type: Function,
      default: () => {}
    },
    onValueChange: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      test: [],
      selectListHeight: true,
      filterText: "展开筛选项",
      childHeight: 135 // 当个筛选项默认高度
    };
  },
  computed: {
    _searchBtnConfig() {
      return {
        ...{
          offset: 6,
          confirm: true,
          reset: false,
          isRow: false,
          filterItem: false,
          showBtn: true
        },
        ...this.searchBtnConfig
      };
    }
  },
  methods: {
    // 改变选项触发
    valueChange(value, type, key) {
      this.onValueChange({ value, type, key });
      this.$emit("onValueChange", { value, type, key });
    },
    // 查询
    search() {
      this.clickSearch(this.formData);
      this.$emit("clickSearch", this.formData);
    },
    // 重置
    Reset() {
      const arr = [];
      if (this.ruleForm && Object.keys(this.ruleForm).length) {
        for (const k in this.ruleForm) {
          if (this.ruleForm[k][0].required || this.ruleForm[k][0].initValue) {
            arr.push(k);
          }
        }
      }
      Object.keys(this.formData).forEach(key => {
        if (!arr.includes(key)) {
          if (
            Object.prototype.toString.call(this.formData[key]) ===
            "[object Array]"
          ) {
            this.formData[key] = [];
          } else {
            this.formData[key] = null;
          }
        }
      });
      this.clickReset();
      this.$emit("clickReset");
    },
    // 展开筛选项|收起筛选项-切换
    retractClick() {
      this.selectListHeight = !this.selectListHeight;
      if (this.selectListHeight) {
        if (this.$refs.searchForm && this.$refs.searchForm.$children.length) {
          //   this.childHeight = this.$refs.searchForm.$children[0].$el.clientHeight;
          //   this.childHeight =  this.childHeight ;
        }
        this.filterText = "展开筛选项";
      } else {
        this.filterText = "收起筛选项";
      }
    }
  }
};
</script>
<style lang="scss">
.clearfix:after,
.cl:after {
  display: block;
  clear: both;
  content: "";
}
.clearfix,
.cl {
  zoom: 1;
}
#xdf-search-form {
  .search-form-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  .searchbtn--show {
    margin-left: 8px;
  }
  &.xdf-search-form {
    overflow: hidden;
    .el-form-item {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      margin-bottom: 16px;
      &.hidden-label__title {
        .el-form-item__label {
          opacity: 0;
        }
      }
    }
    .el-form-item__label {
      line-height: 22px;
      margin-bottom: 8px;
    }
    .el-form-item__content {
      line-height: 0;
      width: 100%;
      flex: 1;
      position: static;
      .el-select {
        width: 100%;
        flex: 1;
      }
      // .el-input {
      //   .el-input__inner {
      //     border: 1px solid #e5e5e5;
      //   }
      // }
    }
    .el-date-editor--datetimerange.el-input,
    .el-date-editor--datetimerange.el-input__inner,
    .el-range-editor.el-input__inner {
      width: 100%;
      border: 1px solid #e5e5e5;
      background-color: #f5f5f5;
    }
    // .el-range-input {
    //   font-size: 16px;
    //   background-color: #f5f5f5;
    // }
    .el-select__tags > span {
      display: flex;
      width: calc(100% - 20px);
    }
    .el-select__tags > span {
      .el-tag.el-tag--info {
        max-width: calc(100% - 40%);
        overflow: hidden;
        vertical-align: middle;
        .el-select__tags-text {
          width: 100%;
        }
        &:first-child {
          .el-select__tags-text {
            /* max-width: fit-content; */
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            vertical-align: middle;
            width: calc(100% - 15px);
          }
        }
      }
    }
    &.xdf-search-form__row {
      .el-form-item {
        flex-direction: row;
        align-items: center;
        text-align: left;
        .el-form-item__label {
          text-align: right;
          line-height: 32px;
          margin-bottom: 0;
        }
        .el-form-item__content {
          .el-input--small {
            display: flex;
          }
        }
        &.hidden-label__title {
          .el-form-item__label {
            display: none;
          }
        }
      }
    }
    &.xdf-search-form__label {
      .el-form-item {
        .el-form-item__label {
          display: none;
        }
      }
    }
    .xdf-search-btn {
      margin-top: 2px;
      margin-right: 10px;
      width: 100%;
      padding-right: 10px;
    }
    .el-form-item__error {
      padding-top: 2px;
    }
    // .el-button {
    //   display: inline-block;
    //   padding: 8px 16px;
    //   cursor: pointer;
    //   border-radius: 4px;
    //   outline: 0;
    //   line-height: 1;
    //   font-size: 14px;
    //   opacity: 1;
    // }
    // .el-button--primary {
    //   border: 1px solid #4cc9ab;
    //   background-color: #4cc9ab;
    // }
  }
}
</style>
