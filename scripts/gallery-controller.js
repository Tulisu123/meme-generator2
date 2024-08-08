'use strict';

function onInit(){
    renderImages();
}

function renderImages(keywords=null){
    let images;
    if (keywords) {
        images = keywords;
    } else {
        images = getImages();
    }
    let elGalleryContainer = document.querySelector('.gallery-container');

    let strHtml = `
        <img onclick="document.getElementById('fileInput').click()" alt="upload" src="images/upload.png">
        <input type="file" id="fileInput" style="display:none" onchange="onUploadImage(event)">
    `
     + images.map(img =>
         `<img onclick="onSelectImage('${img.id}'); renderEditView()" src="${img.url}">`
        ).join('');

    elGalleryContainer.innerHTML = strHtml;
}

function onSelectImage(imgId) {
    document.querySelector('.gallery').classList.add('display-none');
    document.querySelector('.saved-meme').classList.add('display-none');
    document.querySelector('.edit-meme').classList.remove('display-none');

    let meme = getMeme();
    meme.selectedImgId = imgId;
}

function onUploadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const newImgId = `img-${Date.now()}.jpg`;
        const newImgUrl = e.target.result;

        gImgs.push({ id: newImgId, url: newImgUrl, keywords: [] })
        renderImages()
    }

    reader.readAsDataURL(file);
}

function onSearchKeyword(keyword) {
    if (keyword === '') {
        renderImages();
    } else {
        let keywordResults = searchKeyword(keyword);
        renderImages(keywordResults);
    }
}
