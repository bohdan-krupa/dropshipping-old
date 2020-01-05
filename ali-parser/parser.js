const Nightmare = require('nightmare')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')

const nightmare = Nightmare({ show: true })
const URLs = [
  ['https://www.aliexpress.com/item/4000039874281.html', 20, 'Hoodie Not Today', true],
  ['https://www.aliexpress.com/item/32905925277.html', 35, 'Hoodie Lil Peep', true],
  ['https://www.aliexpress.com/item/32907803019.html', 35, 'XXXTENTACION hoodie', false],
  ['https://www.aliexpress.com/item/32894551612.html', 15, 'T-shirt Rick and Morty', false],
  ['https://www.aliexpress.com/item/4000347240949.html', 18, 'Astroworld hoodie', true],
  ['https://www.aliexpress.com/item/4000178015861.html', 18, 'Rick and Morty T-shirt', true],
  ['https://www.aliexpress.com/item/32851794337.html', 25, 'Rick and Morty hoodie', false],
  ['https://www.aliexpress.com/item/4000304349349.html', 20, 'Black XXXTENTACION hoodie', false],
  ['https://www.aliexpress.com/item/4000112495427.html', 30, 'Dead by daylight hoodie', false],
  ['https://www.aliexpress.com/item/4000519656531.html', 14, 'Star Wars hoodie', true],
  ['https://www.aliexpress.com/item/4000077405158.html', 20, 'Jesus T-shirt', false],
  ['https://www.aliexpress.com/item/4000299783204.html', 20, 'Upset T-shirt', false],
  ['https://www.aliexpress.com/item/4000078445357.html', 18, 'Rick and Morty T-Shirt 2', true],
  ['https://www.aliexpress.com/item/32746481085.html', 40, 'Naruto hoodie', false],
  ['https://www.aliexpress.com/item/4000165236701.html', 20, 'Shelby turtleneck', true],
  ['https://www.aliexpress.com/item/10000003812051.html', 40, 'Riverdale hoodie', false],
  ['https://www.aliexpress.com/item/4000217392120.html', 50, 'Jordan hoodie', false],
  ['https://www.aliexpress.com/item/4000293823618.html', 40, 'Rick and Morty Space hoodie', false],
  ['https://www.aliexpress.com/item/4000144140430.html', 30, 'Rose hoodie', true],
  ['https://www.aliexpress.com/item/4000130607602.html', 40, 'Superstar Chat Hoodie', true],
  ['https://www.aliexpress.com/item/4000063833751.html', 30, 'Rick and Morty Jurassic World hoodie', false]
]

const download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
  })
}

const parse = element => {
  const data = URLs[element]

  nightmare
    .goto(data[0])
    .wait('body')
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(res => {
      let result = {
        id: parseInt(2954 + element),
        title: data[2],
        price: data[1],
        sizes: [],
        imgs: [],
        types: {},
        specifications: {},
        isAction: data[3]
      }
      const $ = cheerio.load(res)

      $('.sku-property-text').each((i, elem) => {
        result.sizes.push($(elem).find('span').text())
      })

      fs.mkdirSync(`data/${data[2]}`)
      fs.mkdirSync(`data/${data[2]}/types`)
      fs.mkdirSync(`data/${data[2]}/imgs`)

      $('.sku-property-image').each((i, elem) => {
        let photoUrl = $(elem).find('img').attr('src').replace('_50x50.jpg', '')
        let name = $(elem).find('img').attr('title')
        name = name.replace(' ', '-')

        download(photoUrl, `data/${data[2]}/types/${name}.jpg`, () => {})
        result.types[name] = (`img/items/${data[2]}/types/${name}.jpg`)
      })

      $('.images-view-item').each((i, elem) => {
        let photoUrl = $(elem).find('img').attr('src').replace('_50x50.jpg', '')
        download(photoUrl, `data/${data[2]}/imgs/${i}.jpg`, () => {})
        result.imgs.push(`img/items/${data[2]}/imgs/${i}.jpg`)
      })

      $('.product-prop').each((i, elem) => {
        let name = $(elem).find('.property-title').text()
        name = name.replace(':', '').trim()
        const value = $(elem).find('.property-desc').text()

        result.specifications[name] = value
      })

      const jsonResult = JSON.stringify(result, null, '\t')

      fs.appendFileSync(`data/.data`, ',\n' + jsonResult)
  }).catch(err => console.log(err))
}

const element = process.argv.slice(2)[0]

if (element < URLs.length) {
  parse(element)
} else {
  console.log('Too many')
}