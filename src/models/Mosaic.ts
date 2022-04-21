export interface Mosaic {
  divisivility: number;
  amount: number;
}

export interface MosaicStructure {
  id: string;
  divisibility: number;
}

export interface QrForMosaicPresentation {
  version: number;
  mosaicIds: string[];
}

/**
 * /mosaics/{mosaicId}の返り値
 */
export interface ResponseMosaicInfo {
  id: string;
  mosaic: {
    version: number;
    id: string;
    supply: string;
    startHeight: number;
    ownerAddress: string;
    revision: number;
    flags: number;
    divisibility: number;
    duration: number;
  };
}

export interface MosaicTxStructure {
  mosaic: MosaicStructure;
  amount: number;
}