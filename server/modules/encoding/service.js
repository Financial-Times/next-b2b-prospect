import MaskLogger from '@financial-times/n-mask-logger';
const logger = new MaskLogger(['email', 'password']);

function stringToBase64 (str) {
  return Buffer.from(str).toString('base64');
}

function base64ToString (encodedData) {
  return Buffer.from(encodedData, 'base64').toString();
}

export default {
  encode: (data) => {
    return stringToBase64(JSON.stringify(data));
  },
  decode: data => {
    try {
      const decoded = base64ToString(decodeURIComponent(data));
      return JSON.parse(decoded);
    } catch (error) {
      logger.error('Invalid cache data', { data, error });
      return null;
    }

  }
};
