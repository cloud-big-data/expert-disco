const safeParseNumber = (input: string) =>
  // eslint-disable-next-line no-restricted-globals
  isNaN(parseInt(input, 10)) ? input : parseInt(input, 10);

export default safeParseNumber;
