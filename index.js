addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants",
    { 'content-type': 'application/json'})
    .then(res => res.json())
    .then(data => data.variants[Math.random() > .5 ? 1 : 0])
    .then(url => fetch(
      url, {'content-type': 'text/html;charset=UTF-8'}
    ))

}
