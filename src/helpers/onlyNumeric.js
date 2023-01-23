// Можно вести только число
// Пример
// @keypress="onlyNumeric($event)"
export default function onlyNumeric(e) {
  const num = String.fromCharCode(e.keyCode);
  if (/^\d+$/.test(num)) {
    return false;
  }
  e.preventDefault();
  return true;
}
