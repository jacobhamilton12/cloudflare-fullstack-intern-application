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

let containsPg = (val) => val.includes("pg")

async function handleRequest(request) {
  //gets current cookies
  let cookies = request.headers.get('Cookie');
  //sets num to either the 'pg' cookie (if it exists) or a 50% chance of a 1 or a 0. 
  let num = cookies != null && cookies.includes("pg=") ? parseInt(cookies.split(";").find(containsPg).slice(-1)[0]) : (Math.random() > .5 ? 1 : 0)
  //initial fetch to acquire the two possible urls. Then fetches to url based on num  (either the first url or the second)
  let oldResponse = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants",
    { 'content-type': 'application/json'})
    .then(res => res.json())
    .then(data => data.variants[num])
    .then(url => fetch(
      url, {'content-type': 'text/html;charset=UTF-8'}
    ))
  
  //edits elements on the page
  let newResponse = new HTMLRewriter()
    .on('h1#title', new ElementHandler("Variant", "Page #"))
    .on('title', new ElementHandler("Variant", "Jacob Hamilton"))
    .on('p#description', new ElementHandler("This is variant", "This is Jacob's Page #"))
    .on('a#url', {
      element(element){
        element.setAttribute('href', 'http://people.tamu.edu/~jake7054')
      }
    })
    .on('a#url', new ElementHandler("Return to cloudflare.com", "Head to my personal website"))
    .transform(oldResponse)

    //sets the cookie to preserve which page it is on
    newResponse.headers.set('Set-Cookie', 'pg='+num)
    
  return newResponse;
}
