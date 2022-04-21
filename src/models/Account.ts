import { Mosaic, MosaicStructure } from "./Mosaic";

/**
 * アカウントの基本情報
 */
export interface MyAccountInfo {
  address: string;
  delegateNode: string;
}
/**
 * アカウントの基本情報
 */
export interface AccountInfo {
  name: string;
  address: string;
  mosaics: AccountMosaicBalance[];
  delegateNode: string;
  importance: number;
}

export interface AccountMosaicBalance extends MosaicStructure {
  amount: number;
}

/**
 * /accounts or /accounts/{address} の返り値
 */
export interface ResponseAccountInfo {
  id: string;
  account: {
    version: number;
    address: string;
    addressHeight: number;
    publicKey: string;
    publicKeyHeight: number;
    accountType: number;
    supplementalPublicKeys: {
      linked: {
        publicKey: string;
      };
      node: {
        publicKey: string;
      };
      vrf: {
        publicKey: string;
      };
      voting: {
        publicKeys: {
          publicKey: string;
          startEpoch: number;
          endEpoch: number;
        }[];
      };
    };
    activityBuckets: {
      startHeight: number;
      totalFeesPaid: string;
      beneficiaryCount: number;
      rawScore: number;
    }[];
    mosaics: {
      id: string;
      amount: number;
    }[];
    importance: number;
    importanceHeight: number;
  };
}
