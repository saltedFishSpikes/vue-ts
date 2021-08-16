export enum ButtonTypes {
  DEFAULT = "default",
  PRIMARY = "primary",
  TEXT = "text",
  LINK = "link",
}
export enum SizeTypes {
  LARGE = "large",
  DEFAULT = "default",
  SMALL = "small",
}

export enum InputTypes {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  PASSWORD = "password",
}

export enum RadioTypes {
  DEFAULT = 'default',
  BUTTON = 'button'
}
export enum AlignTypes {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}
export enum TableCellType {
  BODY = 'body',
  HEADER = 'header'
}
export type ClassType = Array<string> | string | object
export interface AnyObjType {
  [key: string]: any
}
export interface HtmlObjType {
  [key:string]: HTMLElement
}
export interface SelectOptionType extends AnyObjType {
  key: string | number;
  value?: string | number | boolean;
  label: string | number | Function;
  disabled?: boolean;
}