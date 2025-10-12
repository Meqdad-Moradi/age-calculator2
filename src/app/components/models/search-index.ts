export enum SearchSuggestionDisplayType {
  Land,
  Bezirk,
  Gemeinde,
  WeiterePlz,
  Ortschaft,
  KatastralGemeindeName,
  KastastralGemeindeNummer,
}

export interface RegionItem {
  nummer?: number;
  land?: string;
  bezirk?: string;
  gemeinde?: string;
  plz?: string;
  ortschaft?: string;
  kgName?: string;
  kgNummer?: number;
  okz?: string;
  plzs?: string[];
  isMainPlz?: boolean;
  type: SearchSuggestionDisplayType;
}

export interface SearchRegionResult {
  land: string;
  bezirk: string;
  mainGemeinde: string;
  gemeinde: string;
  ort: string;
  firstLine: string;
  secondLine: string;
  plz: string;
  okz?: string;
}
