export interface LandItem {
  land: string;
  nummer: number;
  bezirke: BezirItem[];
}

export interface BezirItem {
  bezirk: string;
  nummer: number;
  gemeinden: GemeindeItem[];
}

export interface GemeindeItem {
  gemeinde: string;
  plz: string;
  nummer: number;
  ortschaften: OrtItem[];
  kGs: KatastralgemeindeItem[];
}

export interface OrtItem {
  name: string;
  plzs: string[];
  okz: string;
}

export interface KatastralgemeindeItem {
  kgName: string;
  kgNummer: number;
}
