import * as UnitConverter from '@iota/unit-converter';

const convertUnits = UnitConverter.convertUnits;

function round(v: number, r: UnitConverter.Unit) {
  return (Math.round(convertUnits(v, UnitConverter.Unit.i, r) * 100) / 100) + " " + r
}

export const convertIotaBalance = (value: number): string => {
let returnVal = '';
  if (value < 1000) {
    returnVal = `${value} i`;
  } else if (value > 999 && value < 100000) {
    returnVal = round(value, UnitConverter.Unit.Ki)
  } else if (value > 99999 && value < 1000000000) {
    returnVal = round(value, UnitConverter.Unit.Mi)
  } else if (value > 999999999 && value < 1000000000000) {
    returnVal = round(value, UnitConverter.Unit.Gi)
  } else if (value > 999999999999 && value < 1000000000000000) {
    returnVal = round(value, UnitConverter.Unit.Ti)
  } else if (value > 999999999999999) {
    returnVal = round(value, UnitConverter.Unit.Pi)
  }
  return returnVal;
};