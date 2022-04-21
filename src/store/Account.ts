import { atom } from "recoil";
import { AccountInfo, MyAccountInfo } from "../models/Account";

/**
 * アカウントの情報
 */
export const MyAccountStore = atom<MyAccountInfo>({
  key: "MyAccountStore",
  default: {
    address: "---",
    delegateNode: "---",
  },
});

/**
 * 相手のアカウントの情報
 */
export const AccountStore = atom<AccountInfo>({
  key: "AccountStore",
  default: {
    name: "---",
    address: "---",
    delegateNode: "---",
    importance: 0,
    mosaics: [],
  },
});
