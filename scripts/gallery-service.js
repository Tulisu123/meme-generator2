'use strict'

let gImgs = [
    { id: '1.jpg', url: 'images/1.jpg', keywords: ['funny', 'politics'] },
    { id: '2.jpg', url: 'images/2.jpg', keywords: ['animal', 'cute'] },
    { id: '3.jpg', url: 'images/3.jpg', keywords: ['cute', 'animal'] },
    { id: '4.jpg', url: 'images/4.jpg', keywords: ['animal', 'cute'] },
    { id: '5.jpg', url: 'images/5.jpg', keywords: ['cute', 'funny'] },
    { id: '6.jpg', url: 'images/6.jpg', keywords: ['funny'] },
    { id: '7.jpg', url: 'images/7.jpg', keywords: ['cute', 'funny'] },
    { id: '8.jpg', url: 'images/8.jpg', keywords: ['funny'] },
    { id: '9.jpg', url: 'images/9.jpg', keywords: ['funny', 'cute'] },
    { id: '10.jpg', url: 'images/10.jpg', keywords: ['politics', 'funny'] },
    { id: '11.jpg', url: 'images/11.jpg', keywords: ['sport'] },
    { id: '12.jpg', url: 'images/12.jpg', keywords: ['funny'] },
    { id: '13.jpg', url: 'images/13.jpg', keywords: ['funny', 'movies'] },
    { id: '14.jpg', url: 'images/14.jpg', keywords: ['funny', 'movies'] },
    { id: '15.jpg', url: 'images/15.jpg', keywords: ['funny', 'movies'] },
    { id: '16.jpg', url: 'images/16.jpg', keywords: ['funny', 'movies'] },
    { id: '17.jpg', url: 'images/17.jpg', keywords: ['funny', 'politics'] },
    { id: '18.jpg', url: 'images/18.jpg', keywords: ['funny', 'movies'] }
];

function getImages() {
    return gImgs


}

function searchKeyword(searchKey) {
    let keywordsFound = []
    gImgs.filter(img => {
        img.keywords.forEach(key => {
            if (key.includes(searchKey)) {
                keywordsFound.push(img)
            }
        })
    })
    return keywordsFound
}