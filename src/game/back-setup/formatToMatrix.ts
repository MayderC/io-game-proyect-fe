export const formatToMatrix = (data: number[], width: number): number[][] => {
  const matrix = [];
  let row = [];
  let cont = 0;
  for (let i = 0; i < data.length; i++) {
    row.push(data[i]);
    cont++;
    if (cont === width) {
      matrix.push(row);
      row = [];
      cont = 0;
    }
  }
  console.log(matrix);
  return matrix;
};
