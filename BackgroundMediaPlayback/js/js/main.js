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

    const baseURL = /^ms-appx\b/.test(location.protocol)
        ? 'ms-appx:///'
        : location.href.replace(/[-\w]+.html$/, '')

    const mediaPlayer = new MediaPlayer
    mediaPlayer.autoPlay = false

    const controls = document.querySelector('#player-controls')
    const list = document.querySelector('#playlist-dropdown')
    const listMenu = list.querySelector('.dropdown-menu')

    const getJSON = (url) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.open('get', url, true)
        xhr.responseType = 'json'
        xhr.onload = () => {
            const status = xhr.status;
            if (status == 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        }
        xhr.send()
    })

    getJSON(baseURL + 'assets/playlist.json')
        .catch((e) => console.log(1, e))
        .then((json) => {
            const playlist = new MediaPlaybackList
            playlist.autoRepeatEnabled = true

            const items = json.mediaList.items
            items.forEach((object, index) => {
                const source = MediaSource.createFromUri(new Uri(baseURL + object.mediaUri))
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
