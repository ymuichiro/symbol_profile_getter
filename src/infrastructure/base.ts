import { SystemError } from "./error";

interface RequestOptions {
  /** millisecond */
  timeout?: number;
}

export default class BaseScripts {
  /**
   * REST API向けのURIを生成する
   * @param baseUrl sheme + autority
   * @param paths pathの配列
   * @returns uri
   */
  protected static getRestUri(baseUrl: string, ...paths: string[]): string {
    baseUrl = baseUrl.trim().replace(/\/$/, "");
    const urls: string[] = [baseUrl];
    for (let index = 0; index < paths.length; index++) {
      urls.push(paths[index].trim().replace(/^\//, "").replace(/\/$/, ""));
    }
    return urls.join("/");
  }

  /**
   * fetch (get)向けのクエリを生成する
   * @param uri
   * @param query
   * @returns
   */
  static addRequestQuery(uri: string, query: { [key: string]: any; }): string {
    const [url] = uri.split("?");
    const keys = Object.keys(query);
    const queries: string[] = [];
    for (let index = 0; index < keys.length; index++) {
      if (Array.isArray(query[keys[index]])) {
        for (let index2 = 0; index2 < query[keys[index]].length; index2++) {
          queries.push(`${keys[index]}=${query[keys[index]][index2]}`);
        }
      } else {
        queries.push(`${keys[index]}=${query[keys[index]]}`);
      }
    }
    if (queries.length > 0) {
      return `${url}?${queries.join("&")}`;
    } else {
      return uri;
    }
  }

  /**
   * fetch (post)向けのbodyを生成する
   * @param uri
   * @param body
   * @returns
   */
  static addRequestBody(body: { [key: string]: any; }): string {
    return JSON.stringify(body);
  }

  /**
   * 指定されたURLにFetchを実行する
   * @param url
   * @param init
   * @param options
   * @returns
   */
  static async request(url: RequestInfo, init?: RequestInit, options?: RequestOptions): Promise<Response> {
    const controler = new AbortController();
    const t = options ? (options.timeout ? options.timeout : 60 * 1000) : 60 * 1000;
    const timeout = setTimeout(() => controler.abort(), t);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    try {
      const response = await fetch(url, { ...init, headers, signal: controler.signal });
      if (!response.ok || response.status >= 400) {
        throw new Error();
      }
      return response;
    } catch (e) {
      throw new SystemError("通信エラー", { console: "request failer", view: "通信エラー" });
    } finally {
      clearTimeout(timeout);
    }
  }
}
