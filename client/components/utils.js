export const sendMessage = data => {
  parent.postMessage(JSON.stringify(data), '*');
}

export const dispatchTrackingEvent = ({ action, category, data = { formType: 'next.b2b-prospect' } }) => {

  let detail = Object.assign({}, data, { action, category });
  let event = (() => {
    try {
      return new CustomEvent('oTracking.event', { bubbles: true, cancelable: true, detail });
    } catch (e) {
      return CustomEvent.initCustomEvent('oTracking.event', true, true, detail);
    }
  })();

  document.body.dispatchEvent(event);
}
