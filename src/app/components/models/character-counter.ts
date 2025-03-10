export const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export const alphabetLower = alphabet.map((letter) => letter.toLowerCase());

export type Frequency = Record<string, number>;
export interface CharacterState {
  char: string;
  count: number;
  percentage: number;
}
