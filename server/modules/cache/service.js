import MaskLogger from '@financial-times/n-mask-logger';
const logger = new MaskLogger(['email', 'password']);

function btoa (str) {
  return Buffer.from(str).toString('base64');
}

function atob (encodedData) {
  return Buffer.from(encodedData, 'base64').toString();
}

export default {
  encode: (data) => {
    return btoa(JSON.stringify(data));
  },
  decode: data => {
    try {
      const decoded = atob(data);
      return JSON.parse(decoded);
    } catch (error) {
      logger.error('Invalid cache data', { data, error });
      return null;
    }

  }
};
