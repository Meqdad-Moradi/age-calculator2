export const matDateFormat = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export function compate(option = '', asc = true) {
  let compresion = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (a: any, b: any) => {
    if (a[option] > b[option]) {
      compresion = 1;
    } else {
      compresion = -1;
    }
  };
  return !asc ? compresion * -1 : compresion;
}
