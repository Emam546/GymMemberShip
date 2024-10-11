export interface Context {}
export namespace ApiRender {
  interface OnMethods {}
  interface OnceMethods {}
}
export namespace Api {
  interface OnMethods {}
  interface OnceMethods {}
  interface HandleMethods {
    getData(src: string): string | null;
  }
  interface HandleOnceMethods {}
}
