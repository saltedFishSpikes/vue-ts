<template>
  <div :class="tableClass" ref="table" :style="{ width }">
    <!-- 固定表头时右上角 -->
    <div
      :style="{
        height: `${rightTopCorner.height}px`,
        width: `${rightTopCorner.width}px`,
      }"
      class="right-top-corner"
      :class="cellClass(0, '', 'body')"
      v-if="rightTopCorner.height && rightTopCorner.width"
    ></div>
    <!-- 固定表头 -->
    <div
      class="table-header"
      :style="{ marginRight: `${rightTopCorner.width}px` }"
      ref="header"
      @scroll="tableXScroll('body', $event)"
      v-if="headerFix"
    >
      <div
        v-for="{ type, column } of tableFilterFixed"
        :key="type"
        :class="fixedClass(type)"
        :style="{
          maxWidth: type === 'center' ? width : 'unset',
          left: type === 'left' ? leftFixed + 'px' : 'unset',
          right: type === 'right' ? rightFixed + 'px' : 'unset',
        }"
        :ref="`header-${type}`"
      >
        <table :class="contentClass()" cellspacing="0" cellpadding="0">
          <thead>
            <tr v-for="i of type === 'center' ? headerDeep : 1" :key="i">
              <th
                v-for="h of getItemsByDeep(column, 'children', i)"
                :key="h.key"
                :rowspan="
                  type !== 'center' || h.children ? 1 : headerDeep - i + 1
                "
                :colspan="
                  h.children ? arrayFlat(h.children, 'children').length : 1
                "
                :class="cellClass(0, h.key, 'header')"
              >
                <div
                  :style="{
                    width: !h.children ? `${getCellWidth(h.width)}px` : 'unset',
                    height:
                      type !== 'center'
                        ? `${rightTopCorner.height}px`
                        : 'unset',
                  }"
                >
                  <m-render
                    v-if="h.headerRender"
                    :renderFun="h.headerRender.bind(this, h)"
                  ></m-render>
                  <span v-else>{{ h.title }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
    <div
      class="table-body"
      ref="body"
      @scroll="tableXScroll('header', $event)"
      :style="{ height }"
    >
      <div
        v-for="{ type, column } of tableFilterFixed"
        :key="type"
        :class="fixedClass(type)"
        :style="{
          left: type === 'left' ? leftFixed + 'px' : 'unset',
          right: type === 'right' ? rightFixed + 'px' : 'unset',
        }"
      >
        <table :class="contentClass()" cellspacing="0" cellpadding="0">
          <thead v-if="!headerFix" :ref="`header-${type}`">
            <tr v-for="i of headerDeep" :key="i">
              <!-- 
                单独获取那一层tr的th（嵌套第n层的子元素）
                th有子元素，纵向占一格，横向占最底层子元素个数的格子
                没有子元素，纵向占剩余的层数，横向占一格
               -->
              <th
                v-for="h of getItemsByDeep(column, 'children', i)"
                :key="h.key"
                :rowspan="
                  type !== 'center' || h.children ? 1 : headerDeep - i + 1
                "
                :colspan="
                  h.children ? arrayFlat(h.children, 'children').length : 1
                "
                :class="cellClass(0, h.key, 'header')"
              >
                <div
                  :style="{
                    height:
                      type !== 'center'
                        ? `${rightTopCorner.height}px`
                        : 'unset',
                  }"
                >
                  <m-render
                    v-if="h.headerRender"
                    :renderFun="h.headerRender.bind(this, h)"
                  ></m-render>
                  <span v-else>{{ h.title }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(b, index) of tableData"
              :key="index"
              @click="$emit('on-row-click', b, index)"
            >
              <td
                v-for="col of arrayFlat(column, 'children', headerDeep)"
                :key="col.key"
                :class="cellClass(index, col.key, 'body')"
                @click="$emit('on-cell-click', b[col.key], index)"
              >
                <div :style="{ width: `${getCellWidth(col.width)}px` }">
                  <m-render
                    v-if="col.bodyRender"
                    :renderFun="col.bodyRender.bind(this, b[col.key])"
                  ></m-render>
                  <span v-else>{{ b[col.key] }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// 注：若每列设置宽度，表格总宽度width大于每列之和，样式会出现问题
import { AlignTypes, TableCellType } from "@/common/init"; // eslint-disable-line no-unused-vars
import { defineComponent, PropType, VNode, nextTick } from "vue"; // eslint-disable-line no-unused-vars
import { mergeClass, getDeep, arrayFlat, getItemsByDeep } from "@/common/util";
import Render from "./Render.vue";
type renderFun = (data: any, h: Function) => VNode;
interface TableColumnType {
  key: string;
  title: string;
  align?: AlignTypes;
  width?: number;
  fixed?: AlignTypes;
  children?: Array<TableColumnType>;
  headerRender?: renderFun;
  bodyRender?: renderFun;
}
interface FilterColumn {
  type: string;
  column: Array<TableColumnType>;
  columnFlated: Array<TableColumnType>;
}
let prevLeft: number = 0;
let prevRight: number = 0;
const Table = defineComponent({
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    tableColumn: {
      type: Array as PropType<Array<TableColumnType>>,
      default: () => [],
    },
    border: {
      type: Boolean,
      default: false,
    },
    // 斑马纹
    stripe: {
      type: Boolean,
      default: false,
    },
    headerFix: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
  },
  components: {
    "m-render": Render,
  },
  data() {
    return {
      scrollWidth: 0,
      rightTopCorner: { width: 0, height: 0 },
      columnDefaultWidth: 100,
      leftFixed: 0,
      rightFixed: 0,
      getItemsByDeep,
      arrayFlat,
    };
  },
  computed: {
    tableClass(): object {
      return {
        table: true,
        brt: this.border,
        brr: this.border,
        brb: this.border,
      };
    },
    currentColumn(): Array<TableColumnType> {
      return arrayFlat(this.tableColumn, "children", this.headerDeep);
    },
    tableFilterFixed(): Array<FilterColumn> {
      const left = this.tableColumn.filter(
        (item: TableColumnType) =>
          item.fixed === AlignTypes.LEFT &&
          !Object.prototype.hasOwnProperty.call(item, "children")
      );
      const right = this.tableColumn.filter(
        (item: TableColumnType) =>
          item.fixed === AlignTypes.RIGHT &&
          !Object.prototype.hasOwnProperty.call(item, "children")
      );
      let res: Array<FilterColumn> = [];
      const center = [...this.tableColumn].sort((a, b) => {
        const idx = {
          left: 0,
          center: 1,
          right: 2,
        };
        const aI = a.fixed
          ? idx[(a.fixed as AlignTypes) || AlignTypes.CENTER]
          : 1;
        const bI = b.fixed
          ? idx[(b.fixed as AlignTypes) || AlignTypes.CENTER]
          : 1;
        return aI - bI;
      });
      if (left.length)
        res.push({
          type: AlignTypes.LEFT,
          column: left,
          columnFlated: arrayFlat(left, "children", this.headerDeep),
        });
      if (this.currentColumn.length)
        res.push({
          type: AlignTypes.CENTER,
          column: center,
          columnFlated: arrayFlat(center, "children", this.headerDeep),
        });
      if (right.length)
        res.push({
          type: AlignTypes.RIGHT,
          column: right,
          columnFlated: arrayFlat(right, "children", this.headerDeep),
        });
      return res;
    },
    headerDeep(): number {
      return getDeep(this.tableColumn, "children");
    },
  },
  emits: ["on-cell-click", "on-row-click"],
  mounted() {
    nextTick(() => {
      this.resetDOMInfo();
    });
    window.addEventListener("resize", this.resetDOMInfo);
  },
  watch: {
    "tableData.length"() {
      this.resetDOMInfo();
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resetDOMInfo);
  },
  methods: {
    cellClass(rowIndex: number, colKey: string, type: TableCellType): object {
      let colIndex: number = this.currentColumn.findIndex(
        (col: TableColumnType) => col.key === colKey
      );
      if (colIndex === -1) colIndex = 0;
      const initClass = mergeClass(
        this.colClass(colIndex),
        this.rowClass(rowIndex)
      );
      return mergeClass(initClass, {
        brl: this.border,
        brb:
          (rowIndex !== this.tableData.length - 1 &&
            TableCellType.HEADER !== type) ||
          (TableCellType.HEADER === type && this.border),
      });
    },
    colClass(colIndex: number): object {
      const column: TableColumnType = this.currentColumn[colIndex];
      return {
        [`flex-jc-${column.align || "left"}`]: true,
      };
    },
    rowClass(rowIndex: number): object {
      return {
        stripe: rowIndex % 2 === 1 && this.stripe,
      };
    },
    contentClass(): object {
      return {
        "table-content": true,
      };
    },
    fixedClass(type: string): object {
      return {
        "table-fixed": type !== AlignTypes.CENTER,
        "table-fixed_left": type === AlignTypes.LEFT,
        "table-fixed_right": type === AlignTypes.RIGHT,
      };
    },
    getCellWidth(width: number | undefined): number {
      if (width === undefined) width = this.columnDefaultWidth;
      if (this.border) {
        width = (width as number) - 1;
      }
      return width as number;
    },
    getRightTopCorner(): void {
      let res = {
        width: 0,
        height: 0,
      };
      if (this.$refs.body) {
        const { clientWidth, offsetWidth } = this.$refs.body as HTMLDivElement;
        res.width = clientWidth !== offsetWidth ? this.scrollWidth : 0;
      }
      if (this.$refs.header) {
        const { offsetHeight } = this.$refs.header as HTMLHtmlElement;
        res.height = offsetHeight;
      } else if (this.$refs["header-center"]) {
        const { offsetHeight } = this.$refs["header-center"] as HTMLHtmlElement;
        res.height = offsetHeight;
      }
      this.rightTopCorner = res;
    },
    tableXScroll(needToScroll: string, e: Event) {
      if (!e.target) return;
      const { scrollLeft } = e.target as HTMLElement;
      const left = Number(scrollLeft);
      const right = -Number(scrollLeft);
      // 当前操作的另一部分，需要处理非表头固定
      if (this.$refs[needToScroll])
        (this.$refs[needToScroll] as HTMLElement).scrollLeft = left;
      // 固定左侧
      if (prevLeft !== left) {
        this.leftFixed = left;
        prevLeft = left;
      }
      // 固定右侧
      if (prevRight !== right) {
        this.rightFixed = right;
        prevRight = right;
      }
    },
    resetDOMInfo() {
      this.getNewScrollWidth();
      nextTick(() => {
        this.getRightTopCorner();
      });
    },
    getNewScrollWidth() {
      const table = this.$refs.body as HTMLDivElement;
      if (!table) return;
      this.scrollWidth = table.offsetWidth - table.clientWidth;
    },
  },
});
export default Table;
</script>
<style lang="less" scoped>
.table {
  border-color: @greyColor;
  max-width: 100%;
  box-sizing: border-box;
  display: inline-block;
  font-size: 0;
  position: relative;
  div {
    box-sizing: border-box;
    font-size: initial;
  }
  &-fixed {
    position: absolute;
    z-index: 10;

    &_left {
      left: 0;
      top: 0;
      box-shadow: 2px 0 6px -2px rgb(0 0 0 / 20%);
    }
    &_right {
      right: 0;
      top: 0;
      box-shadow: -2px 0 6px -2px rgb(0 0 0 / 20%);
    }
  }
  &-header {
    border-bottom: 1px solid;
    border-color: inherit;
    z-index: 2;
    position: relative;
    overflow-y: hidden;
    background-color: @lightGreyColor;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &-body {
    overflow: auto;
    display: inline-block;
    position: relative;
    width: 100%;
  }
  &-content {
    border-color: @greyColor;
    word-break: break-all;
    word-wrap: break-word;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    thead {
      tr {
        th {
          border-color: inherit;
          background-color: @lightGreyColor;
          box-sizing: border-box;
          div {
            padding: 16px;
            font-weight: bold;
            display: flex;
            justify-content: inherit;
            align-items: center;
          }
        }
      }
    }
    tbody {
      tr {
        td {
          border-color: inherit;
          background-color: @whiteColor;
          box-sizing: border-box;
          div {
            padding: 16px;
          }
        }
        .stripe {
          background-color: @lightGreyColor;
        }
      }
    }
  }
  .right-top-corner {
    position: absolute;
    right: 0;
    top: 0;
    background-color: @lightGreyColor;
  }
}
</style>