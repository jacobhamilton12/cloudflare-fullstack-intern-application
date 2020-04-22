addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

class ElementHandler {
  constructor(before, after){
    this.before = before;
    this.after = after;
  }
  text(text){
    text.replace(text.text.replace(this.before, this.after))
  }
}
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let oldResponse = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants",
    { 'content-type': 'application/json'})
    .then(res => res.json())
    .then(data => data.variants[Math.random() > .5 ? 1 : 0])
    .then(url => fetch(
      url, {'content-type': 'text/html;charset=UTF-8'}
    ))

  let newResponse = new HTMLRewriter()
    .on('h1#title', new ElementHandler("Variant", "Jacob's Page"))
    .on('title', new ElementHandler("Variant", "Jacob Hamilton"))
    .on('p#description', new ElementHandler("This is variant", "This is Jacob's Page #"))
    .on('a#url', {
      element(element){element.replace(`<a class="inline-flex justify-center w-full rounded-md border border-transparent
       px-4 py-2 bg-red-600 text-base leading-6 font-medium shadow-sm hover:bg-red-500 focus:outline-none 
       focus:border-green-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5" href="http://people.tamu.edu/~jake7054" id="url">
      Go to people.tamu.edu/~jake7054
    </a>`, {html: true})}
    })
    .transform(oldResponse)
    
  return newResponse;
}
