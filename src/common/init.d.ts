export declare enum ButtonTypes {
    DEFAULT = "default",
    PRIMARY = "primary",
    TEXT = "text",
    LINK = "link"
}
export declare enum SizeTypes {
    LARGE = "large",
    DEFAULT = "default",
    SMALL = "small"
}
export declare enum InputTypes {
    TEXT = "text",
    TEXTAREA = "textarea",
    NUMBER = "number",
    PASSWORD = "password"
}
export declare enum RadioTypes {
    DEFAULT = "default",
    BUTTON = "button"
}
export declare enum AlignTypes {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center"
}
export declare enum TableCellType {
    BODY = "body",
    HEADER = "header"
}
export declare type ClassType = Array<string> | string | object;
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
