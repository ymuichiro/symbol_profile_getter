/**
 * カスタムエラー
 */
export class SystemError extends Error {

  /** ユーザー向けのエラーメッセージ */
  public viewMessage: string;

  constructor(name: string, message: { console: string, view: string; }) {
    super();
    this.name = name;
    this.message = message.console;
    this.viewMessage = message.view;
  }
}