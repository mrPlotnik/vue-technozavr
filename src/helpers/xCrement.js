export default function xCrement(value, bool) {
  let newValue = null;
  if (bool) {
    newValue = value + 1;
    return newValue;
  }
  if (value === 1) {
    return value;
  }
  newValue = value - 1;
  return newValue;
}
