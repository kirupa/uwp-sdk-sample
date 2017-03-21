//// Copyright (c) Microsoft Corporation. All rights reserved

document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    const Uri = Windows.Foundation.Uri
    const MediaSource = Windows.Media.Core.MediaSource
    const MediaPlaybackItem = Windows.Media.Playback.MediaPlaybackItem
    const MediaPlaybackList = Windows.Media.Playback.MediaPlaybackList
    const MediaPlayer = Windows.Media.Playback.MediaPlayer
    const Storage = Windows.Storage

    const mediaPlayer = new MediaPlayer
    mediaPlayer.autoPlay = false

    const frag = document.createDocumentFragment()
    const scratchpad = frag.appendChild(document.createElement('div'))

    Storage.StorageFile.getFileFromApplicationUriAsync(new Uri('ms-appx:///assets/playlist.json'))
        .then((storageFile) => Storage.FileIO.readTextAsync(storageFile))
        .then((jsonText) => {
            const bar = document.querySelector('#control-panel')
            const menu = document.querySelector('#dropdownMenu1 + .dropdown-menu')
            const items = JSON.parse(jsonText).mediaList.items
            const playlist = new MediaPlaybackList
            playlist.autoRepeatEnabled = true

            items.forEach((object, index) => {
                const source = MediaSource.createFromUri(new Uri(object.mediaUri))
                const item = new MediaPlaybackItem(source)
                const props = item.getDisplayProperties()

                props.musicProperties.title = object.title
                item.applyDisplayProperties(props)
                playlist.items.append(item)

                scratchpad.innerHTML = `<li><a href="#">${object.title}</a></li>`
                menu.appendChild(scratchpad.firstChild)
                  .addEventListener('click', () => mediaPlayer.source.moveTo(index))
            })

            mediaPlayer.source = playlist
            bar.querySelector('.glyphicon-play').addEventListener('click',  () => mediaPlayer.play())
            bar.querySelector('.glyphicon-pause').addEventListener('click', () => mediaPlayer.pause())
            bar.querySelector('.glyphicon-forward').addEventListener('click',  () => mediaPlayer.source.moveNext())
            bar.querySelector('.glyphicon-backward').addEventListener('click',  () => mediaPlayer.source.movePrevious())
        })

    document.querySelector('#menu-toggle').addEventListener('click', (e) => {
        e.preventDefault()
        document.querySelector('#wrapper').classList.toggle('toggled')
    })

    document.querySelector('.dropdown-menu').addEventListener('click', ({ target }) => {
        if (target.matches('li a')) {
            const text = target.textContent
            const dropdown = target.parentNode.parentNode.parentNode
            dropdown.querySelector('.dropdown-toggle').innerHTML = `${text} <span class="caret"></span>`
        }
    })
})
