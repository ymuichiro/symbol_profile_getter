import { Address } from "symbol-sdk";
import { Mosaic } from "symbol-sdk/dist/src/model/mosaic/Mosaic";
import { MosaicId } from "symbol-sdk/dist/src/model/mosaic/MosaicId";
import { UInt64 } from "symbol-sdk/dist/src/model/UInt64";
import { ResponseMosaicInfo } from "../models/Mosaic";
import BaseScripts from "./base";

export interface MosaicStructure {
  id: string;
  divisibility: number;
}

const TIME_OUT = 60 * 1000;

export default class MosaicScripts extends BaseScripts {
  /**
   * ネットワークへ送信する際のMosaicObjectを生成する
   * @param mosaicId
   * @param amount
   * @returns
   */
  static createMosaicObject(mosaicId: string, amount: number, divisibility: number): Mosaic {
    return new Mosaic(new MosaicId(mosaicId), this.calculateMosaicUint64(amount, divisibility));
  }

  /**
   * Divisibilityを元に、整数をNW送信時のUint64へ変換する
   * @param amount
   * @param divisibility
   * @returns
   */
  private static calculateMosaicUint64(amount: number, divisibility: number): UInt64 {
    return UInt64.fromUint(amount === 0 ? 0 : amount * Math.pow(10, divisibility));
  }
  /**
   * Divicibilityを元に元の単価を算出する
   * @param amount
   * @param divisibility
   */
  static calculateMosaicAmount(amount: number, divisibility: number): number {
    return amount / Math.pow(10, divisibility);
  }

  /**
   * MosaicIdより、対象Mosaicの詳細を取得する
   * @param uri
   * @param mosaicId
   * @returns
   */
  static async getMosaicInfoFromMosaicId(uri: string, mosaicId: string): Promise<ResponseMosaicInfo> {
    const u = this.getRestUri(uri, "mosaics", new MosaicId(mosaicId).toHex());
    const r = await this.request(u, undefined, { timeout: TIME_OUT });
    const j = (await r.json()) as ResponseMosaicInfo;
    const ownerAddress = Address.createFromEncoded(j.mosaic.ownerAddress).plain();
    return { ...j, mosaic: { ...j.mosaic, ownerAddress } };
  }

  /**
   * 複数のMosaicIDより詳細を取得する
   */
  static async getMosaicsInfoFromMosaicIds(uri: string, mosaicIds: string[]): Promise<ResponseMosaicInfo[]> {
    const u = this.getRestUri(uri, "mosaics");
    const r = await this.request(u, { method: "POST", body: JSON.stringify({ mosaicIds: mosaicIds }) }, { timeout: TIME_OUT });
    const j = (await r.json()) as ResponseMosaicInfo[];
    let result: ResponseMosaicInfo[] = [];
    for (let index = 0; index < j.length; index++) {
      const ownerAddress = Address.createFromEncoded(j[index].mosaic.ownerAddress).plain();
      result.push({ ...j[index], mosaic: { ...j[index].mosaic, ownerAddress } });
    }
    return result;
  }

  /**
   * 複数モザイク構成情報を生成する
   */
  static async getMosaicStructuresFromMosaicIds(uri: string, mosaicIds: string[]): Promise<MosaicStructure[]> {
    const hexIds: string[] = [];
    for (let index = 0; index < mosaicIds.length; index++) {
      hexIds.push(new MosaicId(mosaicIds[index]).toHex());
    }
    const mosaicsInfo = await this.getMosaicsInfoFromMosaicIds(uri, hexIds);
    const results: MosaicStructure[] = [];
    for (let index = 0; index < mosaicsInfo.length; index++) {
      results.push({
        id: mosaicsInfo[index].mosaic.id,
        divisibility: mosaicsInfo[index].mosaic.divisibility,
      });
    }
    return results;
  }
}
