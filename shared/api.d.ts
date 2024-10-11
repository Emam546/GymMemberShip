import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";
type ConvertToIpCMainFunc<T extends (...args: any) => any> = (
  event: IpcMainEvent,
  ...args: Parameters<T>
) => void;
type ExcludeFirst<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Rest
  : never;
type ConvertFromIpCMainFunc<
  T extends (event: IpcMainEvent, ...args: any) => any
> = (...args: ExcludeFirst<Parameters<T>>) => ReturnType<T>;
type ConvertToIpCHandleMainFunc<T extends (...args: any[]) => any> = (
  event: IpcMainInvokeEvent,
  ...args: Parameters<T>
) => ReturnType<T>;
export namespace ApiMain {
  interface OnMethods {
    log(...args: any[]): void;
    setTitle(name: string): void;
    closeWindow(): void;
    setContentHeight(height: number): void;
    setContentWidth(width: number): void;
    minimizeWindow(): void;
    ToggleWindowMaximizeState(): void;
    hideWindow(): void;
    quitApp(): void;
    center(): void;
    alert(message: string, title?: string): any;
    confirm(message: string, title?: string): boolean;
  }
  interface OnceMethods {}
  interface HandleMethods {
    saveFile(data: Buffer, filename: string): Promise<boolean>;
  }
  interface HandleOnceMethods {}
  namespace Render {
    interface OnMethods {
      onToggleWindowState(state: boolean): void;
    }
    interface OnceMethods {}
  }
}
