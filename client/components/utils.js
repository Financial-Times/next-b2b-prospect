export const sendMessage = data => {
  parent.postMessage(data, '*');
}
