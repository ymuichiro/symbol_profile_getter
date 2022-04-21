import { Address } from "symbol-sdk/dist/src/model/account/Address";
import MosaicScripts from "./mosaic";
import { AccountMosaicBalance, ResponseAccountInfo } from "../models/Account";
import BaseScripts from "./base";

export default class AccountScripts extends BaseScripts {
  static TIMEOUT = 60 * 1000;

  /**
   * アカウントの情報を取得する
   * @param uri
   * @param rawAddress
   */
  static async createAccountInfoFromAddress(uri: string, rawAddress: string): Promise<ResponseAccountInfo> {
    const address = Address.createFromRawAddress(rawAddress);
    const u = this.getRestUri(uri, "accounts", address.plain());
    const r = await this.request(u, undefined, { timeout: this.TIMEOUT });
    const account = (await r.json()) as ResponseAccountInfo;
    const mosaics = await Promise.all(account.account.mosaics.map(e => ({ id: e.id, amount: Number(e.amount) })));
    return {
      id: account.id,
      account: {
        version: account.account.version,
        address: address.plain(),
        addressHeight: Number(account.account.addressHeight),
        publicKey: account.account.publicKey,
        publicKeyHeight: Number(account.account.publicKeyHeight),
        accountType: account.account.accountType,
        supplementalPublicKeys: { ...account.account.supplementalPublicKeys },
        activityBuckets: [...account.account.activityBuckets],
        mosaics: mosaics,
        importance: Number(account.account.importance),
        importanceHeight: Number(account.account.importanceHeight),
      }
    };
  }

  /**
   * アドレスに紐づくMosaicの残高情報を取得する
   */
  static async getBalanceFromAddress(address: string, node: string): Promise<AccountMosaicBalance[]> {
    address = Address.createFromRawAddress(address).plain();
    const accountInfo = await AccountScripts.createAccountInfoFromAddress(node, address);
    let mosaics: AccountMosaicBalance[] = [];
    const wait = accountInfo.account.mosaics.map(async mosaic => {
      const mosaicInfo = await MosaicScripts.getMosaicInfoFromMosaicId(node, mosaic.id);
      mosaics.push({
        id: mosaic.id,
        divisibility: mosaicInfo.mosaic.divisibility,
        amount: MosaicScripts.calculateMosaicAmount(mosaic.amount, mosaicInfo.mosaic.divisibility),
      });
    });
    await Promise.all(wait);
    return mosaics;
  };
}
