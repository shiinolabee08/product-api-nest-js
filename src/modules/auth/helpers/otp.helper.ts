export function generateOtp() {
  function shuffle(o) {
    const data = o;
    let j;
    let x;
    let i = o.length;

    for (
      i = o.length;
      i;
      // eslint-disable-next-line no-plusplus
      j = Math.floor(Math.random() * i), x = data[--i], data[i] = o[j], data[j] = x
    );
    return o;
  }

  return shuffle('0123456789'.split('')).join('').substring(0, 4);
}
