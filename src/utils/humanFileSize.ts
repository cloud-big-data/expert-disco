const humanFileSize = (size?: number) => {
  if (!size) return;
  const i = Math.floor(Math.log(size) / Math.log(1024));

  return `${Number((size / 1024 ** i).toFixed(2)) * 1}${
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  }`;
};

export default humanFileSize;
