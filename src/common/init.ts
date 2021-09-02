import { VNode } from "vue";

export enum ButtonTypes {
  DEFAULT = "default",
  PRIMARY = "primary",
  TEXT = "text",
  LINK = "link"
}
export enum SizeTypes {
  LARGE = "large",
  DEFAULT = "default",
  SMALL = "small"
}

export enum InputTypes {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  PASSWORD = "password"
}

export enum RadioTypes {
  DEFAULT = "default",
  BUTTON = "button"
}
export enum AlignTypes {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center"
}
export enum TableCellType {
  BODY = "body",
  HEADER = "header"
}

export enum AjaxType {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  HEAD = "head",
  OPTIONS = "options",
  TRACE = "trace",
  CONNECT = "connect"
}

export enum ToastOrDialogType {
  INFO = "info",
  SUCCESS = "success",
  FAIL = "fail",
  WARN = "warn"
}

export type ClassType = Array<string> | string | object;
export interface AnyObjType {
  [key: string]: any;
}
export interface HtmlObjType {
  [key: string]: HTMLElement;
}
export interface SelectOptionType extends AnyObjType {
  key: string | number;
  value?: string | number | boolean;
  label: string | number | Function;
  disabled?: boolean;
}
export interface FunType<T> {
  show: (obj: T, type?: ToastOrDialogType) => void;
  success: (obj: T) => void;
  info: (obj: T) => void;
  fail: (obj: T) => void;
  warn: (obj: T) => void;
  close?: (id: number) => void;
  closeAll?: () => void;
}
export interface ToastOptions {
  time?: number;
  offset?: number;
  maxWidth?: string;
  content?: string;
  type?: ToastOrDialogType;
  closeable?: boolean;
  render?: Function;
  onDestory?: Function;
  zIndex?: number;
}

export interface DialogOptions {
  offset?: number;
  width?: string;
  content?: string;
  type?: ToastOrDialogType;
  title?: string;
  contentRender?: () => VNode;
  footerRender?: () => VNode;
  titleRender?: () => VNode;
  showMask?: boolean;
  showClose?: boolean;
  maskClose?: boolean;
  beforeClose?: Function;
  onOk?: Function;
  okText?: string;
  onCancel?: Function;
  cancelText?: string;
}

export type DialogFunType = FunType<DialogOptions | string | number>;
export type ToastFunType = FunType<ToastOptions | string | number>;
