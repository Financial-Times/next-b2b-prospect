import es from '@financial-times/n-es-client';

export default {
  get: (uuid) => {
    return es.get(uuid, { _source: ['id', 'title'] });
  }
}
