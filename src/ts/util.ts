export function validateNumber(value:number, propertyName:string):number {
  if (!isFinite(value)) {
    throw new TypeError(propertyName + ' must be a finite number');
  }

  return Number(value);
};