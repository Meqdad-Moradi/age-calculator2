export interface Country {
  flags: Flags;
  name: Name;
  capital: string[];
  region: string;
  languages: Languages;
  area: number;
  population: number;
  continents: string[];
}

export interface Flags {
  png: string;
  svg: string;
  alt: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface NativeName {
  eng: Eng;
}

export interface Eng {
  official: string;
  common: string;
}

export interface Languages {
  eng: string;
}
