//// Copyright (c) Microsoft Corporation. All rights reserved

document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    if (typeof Windows === 'undefined') {
        return
    }
    const Uri = Windows.Foundation.Uri
    const MediaSource = Windows.Media.Core.MediaSource
    const MediaPlaybackItem = Windows.Media.Playback.MediaPlaybackItem
    const MediaPlaybackList = Windows.Media.Playback.MediaPlaybackList
    const MediaPlayer = Windows.Media.Playback.MediaPlayer
    const Storage = Windows.Storage

    const mediaPlayer = new MediaPlayer
    mediaPlayer.autoPlay = false

    const controls = document.querySelector('#player-controls')
    const list = document.querySelector('#playlist-dropdown')
    const listMenu = list.querySelector('.dropdown-menu')
    const rootURL = location.protocol === 'ms-appx-web:'
        ? 'ms-appx:///'
        : location.href.replace(/\bindex.html$/, '')
    
    Storage.StorageFile.getFileFromApplicationUriAsync(new Uri(`${rootURL}assets/playlist.json`))
        .then((storageFile) => Storage.FileIO.readTextAsync(storageFile))
        .then((jsonText) => {
            const playlist = new MediaPlaybackList
            playlist.autoRepeatEnabled = true

            const items = JSON.parse(jsonText).mediaList.items
            items.forEach((object, index) => {
                const source = MediaSource.createFromUri(new Uri(object.mediaUri))
                const item = new MediaPlaybackItem(source)
                const props = item.getDisplayProperties()

                props.musicProperties.title = object.title
                item.applyDisplayProperties(props)
                playlist.items.append(item)

                const li = document.createElement('li')
                li.innerHTML = `<a href="#">${object.title}</a>`
                li.addEventListener('click', () => mediaPlayer.source.moveTo(index))
                listMenu.appendChild(li)
            })

            mediaPlayer.source = playlist

            controls.querySelector('.glyphicon-play').parentNode.addEventListener('click', () => {
                mediaPlayer.play()
            })
            controls.querySelector('.glyphicon-pause').parentNode.addEventListener('click', () => {
                mediaPlayer.pause()
            })
            controls.querySelector('.glyphicon-forward').parentNode.addEventListener('click', () => {
                list.selectedIndex++
                mediaPlayer.source.moveNext()
            })
            controls.querySelector('.glyphicon-backward').parentNode.addEventListener('click', () => {
                list.selectedIndex--
                mediaPlayer.source.movePrevious()
            })
        })

})
