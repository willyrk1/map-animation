
export function getYearFraction(month = 0, day = 0) {
  if (!month) {
    return 0.5
  }
  const mathDate = new Date(2000, month - 1, day || 15)
  return (mathDate.getTime() - new Date(2000, 0).getTime()) / (1000 * 3600 * 24 * 365)
}

export function getDateNumber(inputDate: number[]) {
  return inputDate[0] + getYearFraction(inputDate[1], inputDate[2]);
}
