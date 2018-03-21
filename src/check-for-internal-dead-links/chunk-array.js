module.exports = (input, chunkSize) => {
  const chunks = [];
  const numberOfChunks = Math.ceil(input.length / chunkSize);
  for (let i = 0; i < numberOfChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    chunks[i] = input.slice(start, end);
  }
  return chunks;
};
