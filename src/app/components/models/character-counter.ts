export const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export const alphabetLower = alphabet.map((letter) => letter.toLowerCase());
