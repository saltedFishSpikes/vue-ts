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

export enum ToastType {
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
export interface ToastFunType {
  show: (
    obj: ToastOptions | string | number | boolean,
    type?: ToastType
  ) => void;
  success: (obj: ToastOptions | string | number | boolean) => void;
  info: (obj: ToastOptions | string | number | boolean) => void;
  fail: (obj: ToastOptions | string | number | boolean) => void;
  warn: (obj: ToastOptions | string | number | boolean) => void;
  close: (id: number) => void;
  closeAll: () => void;
}

export interface ToastOptions {
  time?: number;
  offset?: number;
  maxWidth?: string;
  content?: string;
  type?: ToastType;
  closeable?: boolean;
  render?: Function;
}
