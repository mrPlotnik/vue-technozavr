export default function xCrement(value, bool) {
  let newValue = value;
  // Если bool === true, то увеличиваем на 1
  if (bool) {
    newValue = value + 1;
    return newValue;
  }
  // Если bool === false и value === 1, то ничего не делаем
  if (value === 1) {
    return value;
  }
  // Если bool === false и value !== 1,  то увеличиваем на 1
  newValue = value - 1;
  return newValue;
}
