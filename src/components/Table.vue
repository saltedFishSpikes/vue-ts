<template>
  <div :class="tableClass" ref="table" :style="{ width }">
    <!-- 固定表头时右上角 -->
    <div
      :style="{
        height: `${rightTopCorner.height}px`,
        width: `${rightTopCorner.width}px`,
      }"
      class="right-top-corner"
      :class="cellClass(0, 0, 'body')"
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
        :class="fixClass(type)"
        :style="{
          maxWidth: type === 'center' ? width : 'unset',
          left: type === 'left' ? leftFixed + 'px' : 'unset',
          right: type === 'right' ? rightFixed + 'px' : 'unset',
        }"
        :ref="`header-${type}`"
      >
        <table :class="contentClass()" cellspacing="0" cellpadding="0">
          <colgroup>
            <col
              v-for="h of column"
              :key="h.key"
              :width="getCellWidth(h.width)"
            />
          </colgroup>
          <thead>
            <tr>
              <th
                v-for="(h, index) of column"
                :key="h.key"
                :class="cellClass(0, index, 'header')"
              >
                <div :style="{ width: `${getCellWidth(h.width)}px` }">
                  {{ h.title }}
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
        :class="fixClass(type)"
        :style="{
          left: type === 'left' ? leftFixed + 'px' : 'unset',
          right: type === 'right' ? rightFixed + 'px' : 'unset',
        }"
      >
        <table :class="contentClass()" cellspacing="0" cellpadding="0">
          <colgroup>
            <col
              v-for="h of column"
              :key="h.key"
              :width="getCellWidth(h.width)"
            />
          </colgroup>
          <thead v-if="!headerFix">
            <tr>
              <th
                v-for="(h, index) of column"
                :key="h.key"
                :class="cellClass(0, index, 'body')"
              >
                <div :style="{ width: `${getCellWidth(h.width)}px` }">
                  {{ h.title }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(b, index) of tableData" :key="index">
              <td
                v-for="(col, i) of column"
                :key="col.key"
                :class="cellClass(index, i, 'body')"
              >
                <div :style="{ width: `${getCellWidth(col.width)}px` }">
                  {{ b[col.key] }}
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
import { AlignTypes, tableCellType } from "@/common/init"; // eslint-disable-line no-unused-vars
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
import { mergeClass, getScrollWidth } from "@/common/util";
interface TableColumnType {
  key: string;
  title: string;
  align?: AlignTypes;
  width?: number;
  fixed?: AlignTypes;
}
interface filterColumn {
  type: string;
  column: Array<TableColumnType>;
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
      default: true,
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
  data() {
    return {
      scrollWidth: 0,
      rightTopCorner: { width: 0, height: 0 },
      columnDefaultWidth: 0,
      leftFixed: 0,
      rightFixed: 0,
    };
  },
  computed: {
    tableClass(): object {
      return {
        table: true,
        br: this.border,
      };
    },
    tableFilterFixed(): Array<filterColumn> {
      const left = this.tableColumn.filter(
        (item) => item.fixed === AlignTypes.LEFT
      );
      const right = this.tableColumn.filter(
        (item) => item.fixed === AlignTypes.RIGHT
      );
      let res = [];
      const center = [...this.tableColumn].sort((a, b) => {
        const idx = {
          [AlignTypes.LEFT]: 0,
          [AlignTypes.CENTER]: 1,
          [AlignTypes.RIGHT]: 2,
        };
        const aI = a.fixed ? idx[a.fixed || AlignTypes.CENTER] : 1;
        const bI = b.fixed ? idx[b.fixed || AlignTypes.CENTER] : 1;
        return aI - bI;
      });
      if (left.length) res.push({ type: AlignTypes.LEFT, column: left });
      if (this.tableColumn.length)
        res.push({ type: AlignTypes.CENTER, column: center });
      if (right.length) res.push({ type: AlignTypes.RIGHT, column: right });
      return res;
    },
  },
  created() {
    this.scrollWidth = getScrollWidth();
  },
  mounted() {
    this.$nextTick(() => {
      this.resetDOMInfo();
    });
    window.addEventListener("resize", this.resetDOMInfo);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resetDOMInfo);
  },
  methods: {
    cellClass(rowIndex: number, colIndex: number, type: tableCellType): object {
      const initClass = mergeClass(
        this.colClass(colIndex),
        this.rowClass(rowIndex)
      );
      return mergeClass(initClass, {
        brl: this.border && colIndex !== 0,
        brb:
          rowIndex !== this.tableData.length - 1 &&
          tableCellType.HEADER !== type,
      });
    },
    colClass(colIndex: number): object {
      const column: TableColumnType = this.tableColumn[colIndex];
      return {
        [`f-${column.align || "left"}`]: true,
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
    fixClass(type: string): object {
      return {
        "table-fixed": type !== AlignTypes.CENTER,
        "table-fixed_left": type === AlignTypes.LEFT,
        "table-fixed_right": type === AlignTypes.RIGHT,
      };
    },
    getColumnDefaultWidth(): void {
      const table = this.$refs.table as HTMLDivElement;
      if (!table) {
        this.columnDefaultWidth = 0;
        return;
      }
      let wholeWidth: number = table.scrollWidth - this.rightTopCorner.width;
      let count: number = 0;
      this.tableColumn.forEach((col) => {
        if (typeof col.width === "number") {
          wholeWidth -= col.width;
        } else {
          count++;
        }
      });
      if (count === 0) {
        this.columnDefaultWidth = 0;
      } else {
        this.columnDefaultWidth = wholeWidth / count;
      }
    },
    getCellWidth(width: number | undefined): number {
      if (width === undefined) width = this.columnDefaultWidth;
      if (this.border) {
        width = width - 1;
      }
      return width;
    },
    getRightTopCorner(): void {
      if (!this.headerFix) {
        this.rightTopCorner = {
          width: 0,
          height: 0,
        };
        return;
      }
      let res = {
        width: 0,
        height: 0,
      };
      if (this.$refs.body) {
        const { clientWidth, offsetWidth } = this.$refs.body as HTMLDivElement;
        res.width = clientWidth !== offsetWidth ? this.scrollWidth : 0;
      }
      if (this.$refs.header) {
        const { offsetHeight } = this.$refs.header as HTMLDivElement;
        res.height = offsetHeight;
      }
      this.rightTopCorner = res;
    },
    tableXScroll(needToScroll: string, e: Event) {
      if (!e.target) return;
      const { scrollLeft } = e.target as HTMLElement;
      const left = Number(scrollLeft.toFixed(2));
      const right = -Number(scrollLeft.toFixed(2));
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
      this.getRightTopCorner();
      this.getColumnDefaultWidth();
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
    // box-shadow: 0 2px 6px -2px rgb(0 0 0 / 20%);
    border-bottom: 1px solid;
    border-color: inherit;
    z-index: 2;
    position: relative;
    overflow-y: auto;
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
    table-layout: auto;
    word-break: break-all;
    word-wrap: break-word;
    box-sizing: border-box;
    position: relative;
    thead {
      tr {
        th {
          border-color: inherit;
          background-color: @lightGreyColor;
          box-sizing: border-box;
          div {
            padding: 16px;
            font-weight: bold;
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