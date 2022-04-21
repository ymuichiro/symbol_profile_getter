import { NetworkType } from "symbol-sdk/dist/src/model/network/NetworkType";

/**
 * ノードの情報
 */
export interface NodeInfo {
  publicKey: string;
  type: NetworkType;
  url: string;
}

/**
 * /node/info の返り値
 */
export interface ResponseNodeInfo {
  version: number;
  publicKey: string;
  networkGenerationHashSeed: string;
  roles: number;
  port: number;
  networkIdentifier: NetworkType;
  friendlyName: string;
  host: string;
  nodePublicKey: string;
}

/**
 * /node/peers の返り値
 */
export interface ResponseNodePeers {
  version: number;
  publicKey: string;
  networkGenerationHashSeed: string;
  roles: number;
  port: number;
  networkIdentifier: NetworkType;
  friendlyName: string;
  host: string;
  nodePublicKey: string;
}
