import { QRCodeType } from "symbol-qr-library";
import { NetworkType } from "symbol-sdk/dist/src/model/network";

/**
 * 読み取ったQRコードの型
 */
export interface QRJson {
  /** QRコード形式のバージョン */
  v: number;
  /** 読み取ったデータの種別 */
  type: QRCodeType;
  /** ネットワークタイプ */
  network_id: NetworkType;
  chain_id: string;
  data: {
    /** ウォレット上の名前 */
    name: string;
    /** ハイフンなし形式のアドレス */
    address: string;
  };
}
