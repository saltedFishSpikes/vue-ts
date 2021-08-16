<template>
  <div class="calender">
    <div class="calender__header">
      <slot name="header">
        <span>{{ dateFormat(currentYear, currentMonth, currentDay) }}</span>
        <div class="header-divider"></div>
        <m-select
          width="80"
          v-model="year"
          :options="yearList"
          @on-select="$emit('update:currentYear', year)"
        ></m-select>
        <m-divider :size="10"></m-divider>
        <m-select
          width="80"
          v-model="month"
          :options="monthList"
          @on-select="$emit('update:currentMonth', month)"
        ></m-select>
      </slot>
    </div>
    <div class="calender__body">
      <m-table
        :width="width"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :border="border"
        @on-cell-click="onDayClick"
      ></m-table>
    </div>
  </div>
</template>
<script lang="ts">
import { SelectOptionType } from "@/common/init"; // eslint-disable-line no-unused-vars
import { defineComponent } from "vue";
import Table from "./Table.vue";
import Select from "./Select.vue";
import Divider from "./Divide.vue";

type CurrDay = {
  isEmpty: boolean;
  date: number;
  month: number;
  year: number;
  stamp: number;
};
type EmptyDay = {
  isEmpty: boolean;
};
type Day = CurrDay | EmptyDay;

const Calender = defineComponent({
  components: {
    "m-table": Table,
    "m-select": Select,
    "m-divider": Divider,
  },
  props: {
    yearRange: {
      validator: (v: Array<number>) =>
        v instanceof Array &&
        v.length === 2 &&
        v.every((i) => Number.isInteger(i)) &&
        v[1] >= v[0],
      default: () => [1980, 3000],
    },
    currentDay: {
      type: Number,
      default: new Date().getDate(),
    },
    currentMonth: {
      type: Number,
      default: new Date().getMonth() + 1,
    },
    currentYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    width: {
      type: String,
      default: "100%",
    },
    weeks: {
      validator: (v) => v instanceof Array && v.length === 7,
      default: () => [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
    },
    dayRender: {
      type: Function,
      default: (v: Day, h: Function) =>
        h("div", !v.isEmpty ? (v as CurrDay).date : ""),
    },
    dateFormat: {
      type: Function,
      default: (year: number, month: number, day: number): string =>
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}`,
    },
    border: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "update:currentDay",
    "update:currentYear",
    "update:currentMonth",
    "on-day-click",
  ],
  // 不使用箭头函数，tsconfig严格模式下会报错。原因未知
  data: () => {
    return {
      year: 0,
      month: 0,
    };
  },
  computed: {
    dayOfMonth(): Array<Day> {
      const list = new Array(
        new Date(this.currentYear, this.currentMonth, 0).getDate()
      )
        .fill(0)
        .map((i, index) => {
          return {
            isEmpty: false,
            date: index + 1,
            month: this.currentMonth,
            year: this.currentYear,
            stamp: new Date(
              this.currentYear,
              this.currentMonth - 1,
              index + 1
            ).getTime(),
          };
        });
      const emptyBefore = new Array(new Date(list[0].stamp).getDay())
        .fill(0)
        .map(() => ({ isEmpty: true }));
      const emptyAfter = new Array(
        7 - 1 - new Date(list[list.length - 1].stamp).getDay()
      )
        .fill(0)
        .map(() => ({ isEmpty: true }));
      return [...emptyBefore, ...list, ...emptyAfter];
    },
    tableColumn(): Array<Object> {
      return this.weeks.map((item: string | number) => {
        return {
          key: item,
          title: item,
          bodyRender: (data: any, h: Function) => {
            return this.dayRender(data, h);
          },
        };
      });
    },
    tableData(): Array<Object> {
      let res = [];
      for (let i = 0; i < this.dayOfMonth.length / 7; i++) {
        res.push(
          this.dayOfMonth
            .slice(i * 7, (i + 1) * 7)
            .reduce(
              (pre: object, curr: object, index: number) =>
                Object.assign(pre, { [this.weeks[index]]: curr }),
              {}
            )
        );
      }
      return res;
    },
    yearList(): Array<SelectOptionType> {
      return Array.from(
        { length: this.yearRange[1] - this.yearRange[0] },
        (i, index) => this.yearRange[0] + index
      ).map((item) => ({ key: item, value: item, label: item }));
    },
    monthList(): Array<SelectOptionType> {
      return Array.from({ length: 12 }, (i, index) => index + 1).map(
        (item) => ({ key: item, value: item, label: item })
      );
    },
  },
  methods: {
    onDayClick(data: Day, index: number) {
      if (!data.isEmpty) {
        this.$emit("update:currentDay", (data as CurrDay).date);
        this.$emit("on-day-click", data as CurrDay, index);
      }
    },
  },
  watch: {
    currentYear: {
      handler(newV: number) {
        this.year = newV;
      },
      immediate: true,
    },
    currentMonth: {
      handler(newV: number) {
        this.month = newV;
      },
      immediate: true,
    },
  },
});
export default Calender;
</script>

<style lang="less" scoped>
.calender {
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .header-divider {
      flex-grow: 1;
    }
  }
}
</style>