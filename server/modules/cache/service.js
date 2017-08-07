import uuid from 'uuid/v4';
import { TimeCache } from '@financial-times/n-map-cache-light';

const cache = new TimeCache();

export default {
  get: cache.get,
  set: value => {
    const key = uuid();
    cache.set(key, value);
    return key;
  }
};
