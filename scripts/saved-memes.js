'use strict'
function onSaveMeme() {
    let meme = getMeme()

    renderMeme(true) //clearing the marked selected line
    meme.dataUrl = gCanvas.toDataURL('image/png')

    if (!gIsEditingMeme) saveMemeToLocalStorage()
    else{
        const memeIndex = gSavedMemes.findIndex(savedMeme => savedMeme.id === meme.id)
        console.log(memeIndex + 'this is the index to replace')
        gSavedMemes[memeIndex] = JSON.parse(JSON.stringify(meme))
        gIsEditingMeme = false;
    }
}

function moveToSavedMemes() {
    document.querySelector('.gallery').classList.add('display-none')
    document.querySelector('.edit-meme').classList.add('display-none')
    document.querySelector('.saved-meme').classList.remove('display-none')

    renderSavedMemes()
}

function renderSavedMemes() {
    let elMemeContainter = document.querySelector('.saved-memes-container')
    elMemeContainter.innerHTML = ''
    gSavedMemes.forEach((meme, index) => {
        let img = document.createElement('img')
        img.src = meme.dataUrl
        img.onclick = function () {
            openSavedImageActions(meme, index)
        }
        elMemeContainter.appendChild(img)
    })
}
function openSavedImageActions(meme, index) {
    const elMemeContainer = document.querySelector('.saved-memes-container')
    let dialog = document.getElementById(`dialog${index}`)
    if (!dialog) {
        dialog = document.createElement('dialog')
        dialog.id = `dialog${index}`
        // the json stringly is for using object inside an html function// Q: is there a better option?
        const strHtml = `
            <button onclick='editSavedMeme(${JSON.stringify(meme).replace(/'/g, "\\'")}, ${index})'>Edit</button>
            <button id="delete-dialog" onclick="deleteMemeFromSaved('${index}')">Delete</button>
            <button id="close-dialog" onclick="closeDialog('${index}')">Close</button>
        `
        dialog.innerHTML = strHtml;
        elMemeContainer.appendChild(dialog)
    }
    dialog.showModal()
}

function deleteMemeFromSaved(index){
    console.log('removing index:',index)
    gSavedMemes.splice(index,1)
    localStorage.setItem('meme', JSON.stringify(gSavedMemes))
    renderSavedMemes()
}

function editSavedMeme(savedMeme, index) {
    gIsEditingMeme = true
    console.log('meme in edit', savedMeme)
    closeDialog(index)

    onSelectImage(savedMeme.selectedImgId)
    updateGmeme(savedMeme)

    renderEditView()
}

function closeDialog(index) {
    const dialog = document.querySelector(`#dialog${index}`)
    dialog.close()
}