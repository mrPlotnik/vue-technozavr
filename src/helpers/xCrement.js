// Функция инкремента или декремента в зависимости от булевого значения
export default function xCrement(value, bool) {
  // console.log(`Вход: ${value}`);
  let newValue = value;
  // Если bool === true, то увеличиваем на 1
  if (bool) {
    newValue = value + 1;
    // console.log(`Плюс: ${newValue}`);
    return newValue;
  }
  // Если bool === false и value === 1, то ничего не делаем
  if (value === 1) {
    // console.log(`!== 1: ${newValue}`);
    return value;
  }
  // Если bool === false и value !== 1,  то увеличиваем на 1
  newValue = value - 1;
  // console.log(`Минус: ${newValue}`);
  return newValue;
}
