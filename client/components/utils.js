export const sendMessage = data => {
  parent.postMessage(JSON.stringify(data), '*');
}
