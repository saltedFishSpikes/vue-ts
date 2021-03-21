<template>
  <div class="table">
    <table width="100%" :class="tableClass" cellspacing="0" cellpadding="0">
      <col
        v-for="h of tableColumn"
        :key="h.key"
        :width="h.width || 'relative_length'"
      >
      <thead>
        <tr>
          <th
            v-for="(h, index) of tableColumn"
            :key="h.key"
            :class="cellClass(0, index)"
          >
            {{ h.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(b, index) of tableData" :key="index">
          <td
            v-for="i of tableColumn.length"
            :key="i"
            :class="cellClass(index, i - 1)"
          >
            {{ b[columnsObj.get(i - 1)] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { AlignTypes } from "@/common/init"; // eslint-disable-line no-unused-vars
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars

interface TableColumnType {
  key: string;
  title: string;
  align?: AlignTypes;
  width?: number
}
const Table = defineComponent({
  props: {
    tableData: {
      type: Array,
      default: () => [
        { age: 12, name: "小红", gender: 1 },
        { age: 12, name: "小红", gender: 1 },
      ],
    },
    tableColumn: {
      type: Array as PropType<Array<TableColumnType>>,
      default: () => [
        {
          key: "name",
          title: "姓名",
          align: 'center',
          
        },
        {
          key: "age",
          title: "年龄",
          align: 'right'
        },
        {
          key: "gender",
          title: "性别",
        },
      ],
    },
    border: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    columnsObj(): Map<number, string> {
      let res = new Map();
      for (let i = 0; i < this.tableColumn.length; i++) {
        res.set(i, this.tableColumn[i].key);
      }
      return res;
    },
    tableClass(): object {
      return {
        "table-content": true,
        br: this.border,
      };
    },
  },
  methods: {
    cellClass(rowIndex: number, colIndex: number): object {
      return {
        brl: this.border && colIndex !== 0,
        brb: rowIndex !== this.tableData.length - 1,
      };
    },
    colClass() {
      
    }
  },
});
export default Table;
</script>
<style lang="less" scoped>
.table {
  width: 100%;
  box-sizing: border-box;
  .table-content {
    border-color: @greyColor;
    thead {
      tr {
        th {
          padding: 16px;
          background-color: @lightGreyColor;
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 16px;
        }
      }
    }
  }
}
</style>