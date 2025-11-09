export interface Pampers {
  id?: string | null;
  name: string | null;
  date: string | null;
  quantity: number | null;
  price: number | null;
  type: EnPampersItemType | null;
}

export enum EnPampersItemType {
  Pamper = 'Pamper',
  DastmalTar = 'Dastmal tar',
  DastmalKhoshk = 'Dastmal khoshk',
  Shir = 'Shir',
  Other = 'Other',
}

export enum EnTimePeriod {
  SelectTimePeriod = 'Select time period',
}
