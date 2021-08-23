<template>
  <div
    class="upload"
    @drop.prevent="fileDrop"
    @dragenter.prevent
    @dragleave.prevent
    @dragover.prevent
    @click="onclick"
    @paste="filePaste"
  >
    <input
      :disabled="disabled"
      type="file"
      ref="input"
      class="upload__input"
      :multipart="multipart"
      :size="maxSize"
      :accept="accept"
      @change="fileChange"
    />
    <slot name="default">
      <m-button type="primary" size="large" :disabled="disabled"
        >上传文件</m-button
      >
    </slot>
    <div class="upload__files" v-if="showList">
      <slot
        name="file"
        :data="file"
        v-for="(file, index) of modelValue"
        :key="index"
      >
        <div
          class="upload__files-item"
          @mouseenter="showDelete = file"
          @mouseleave="showDelete = null"
        >
          <img
            v-if="isImage(file.name)"
            class="item__img"
            :src="file.pathInHost"
          />
          <span class="item__name ell">{{ file.name }}</span>
          <transition name="delete">
            <div
              class="item__icon"
              v-if="deleteable"
              v-show="showDelete === file"
              @click.stop="$emit('on-delete', file)"
            >
              <i class="iconfont i-shanchu fs-20"></i>
            </div>
          </transition>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
import { setObjectAttr, isImage } from "@/common/util";
import { AjaxType } from "@/common/init";
import Button from "./Button.vue";

type BeforeUploadFun = (files: Array<File>) => boolean;
type onExceededSize = (file: File) => boolean;
type onFileTypeError = (file: File) => boolean;
const Upload = defineComponent({
  components: {
    "m-button": Button,
  },
  emits: ["update:modelValue", "on-delete", "upload-success", "upload-fail"],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    multipart: {
      type: Boolean,
      default: true,
    },
    // input原生的
    accept: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Array as PropType<Array<File>>,
      default: () => [],
    },
    pastable: {
      type: Boolean,
      default: true,
    },
    droppable: {
      type: Boolean,
      default: true,
    },
    // 选文件后过滤不符合的
    fileSuffix: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    showList: {
      type: Boolean,
      default: true,
    },
    deleteable: {
      type: Boolean,
      default: true,
    },
    maxSize: {
      type: Number,
      default: 1024 * 1024 * 10,
    },
    beforeUpload: {
      type: Function as PropType<BeforeUploadFun>,
      default: () => true,
    },
    onExceededSize: {
      type: Function as PropType<onExceededSize>,
      default: () => false,
    },
    onFileTypeError: {
      type: Function as PropType<onFileTypeError>,
      default: () => false,
    },
    withCredentials: {
      type: String,
      default: "",
    },
    uploadUrl: {
      type: String,
      default: "",
    },
    uploadType: {
      type: String as PropType<AjaxType>,
      default: AjaxType.POST,
    },
    uploadHeaders: {
      type: Object as PropType<Headers>,
      default: () => ({}),
    },
    fileKey: {
      type: String,
      default: "file",
    },
    extraData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showDelete: null as File | null,
    };
  },
  computed: {
    isImage(): Function {
      return isImage.bind(this);
    },
    fileSuffixReg(): Array<RegExp> {
      return this.fileSuffix.map(
        (type: string) => new RegExp(`\\.${type}$`, "i")
      );
    },
  },
  methods: {
    onclick(): void {
      (this.$refs.input as HTMLInputElement).click();
    },
    fileChange(e: InputEvent): void {
      const files = Array.from(
        (e.target as HTMLInputElement).files as FileList
      );
      this.setFile(files);
    },
    fileDrop(e: DragEvent): void {
      if (!this.droppable) return;
      const files = Array.from(
        (e.dataTransfer as DataTransfer).files as FileList
      );
      this.setFile(files);
    },
    filePaste(e: ClipboardEvent): void {
      if (!this.pastable) return;
      const files = Array.from(
        (e.clipboardData as DataTransfer).files as FileList
      );
      this.setFile(files);
    },
    setFile(files: Array<File>): void {
      if (this.disabled) return;
      if (!this.multipart) files = [files[0]];
      if (this.fileSuffixReg.length) {
        files = files.filter(
          (file) =>
            this.fileSuffixReg.some((reg) => reg.test(file.name)) ||
            this.onFileTypeError(file)
        );
      }
      files = files.filter(
        (file) => file.size < this.maxSize || this.onExceededSize(file)
      );
      const newFiles = this.modelValue.concat(
        files.map((file) => {
          setObjectAttr(file, "pathInHost", URL.createObjectURL(file));
          return file;
        })
      );
      this.$emit("update:modelValue", newFiles);
      this.defaultUpload();
    },
    defaultUpload(): void {
      if (!this.uploadUrl) return;
      if (!this.beforeUpload(this.modelValue)) return;
      let formData = new FormData();
      this.modelValue.forEach((file) => {
        formData.append(this.fileKey, file);
      });
      Object.keys(this.extraData).forEach((key: string) => {
        formData.append(key, this.extraData[key]);
      });
      fetch(this.uploadUrl, {
        method: this.uploadType,
        body: formData,
        headers: this.uploadHeaders,
      })
        .then((res: Response) => this.$emit("upload-success", res))
        .catch((err: Response) => this.$emit("upload-fail", err));
    },
  },
});
export default Upload;
</script>
<style lang="less" scoped>
.upload {
  padding-left: 5px;
  display: inline-block;
  .upload__input {
    display: none;
  }
  .upload__files {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 10px;
    &-item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 200px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      padding: 10px;
      box-shadow: 0 0 4px @greyColor;
      position: relative;
      &:not(:last-child) {
        margin-right: 10px;
      }
      .item__img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      .item__name {
        font-size: 16px;
        font-weight: 600;
      }
      .item__icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: fade(@blackColor, 70%);
        cursor: pointer;
        & > i {
          color: @whiteColor;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .delete-enter-active,
  .delete-leave-active {
    transition: all 0.3s linear;
  }
  .delete-enter-from,
  .delete-leave-to {
    opacity: 0;
  }
}
</style>