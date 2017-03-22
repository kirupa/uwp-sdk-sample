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

    const bar = document.querySelector('#control-panel')
    const drop = document.querySelector('#dropdownMenu1').parentNode
    const dropLabel = drop.querySelector('.dropdown-toggle')
    const dropMenu = document.querySelector('#dropdownMenu1 + .dropdown-menu')
    const dropItems = dropMenu.getElementsByTagName('li')

    Object.defineProperty(drop, 'selectedIndex', (() => {
       let selectedIndex = -1
       const overflow = (n, min, max) => {
            const range = max - min + 1
            let mod = (n - min) % range
            if (mod < 0) {
                mod += range
            }
            return min + mod
        }
        return {
            configurable: true,
            enumerable: true,
            get() {
                return selectedIndex
            },
            set(index) {
                const lastIndex = Math.max(0, dropItems.length - 1)
                selectedIndex = overflow(index, 0, lastIndex)
                const { innerText } = dropItems[selectedIndex]
                dropLabel.innerHTML = `${innerText} <span class="caret"></span>`
            }
        }
    })())

    Storage.StorageFile.getFileFromApplicationUriAsync(new Uri('ms-appx:///assets/playlist.json'))
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
                dropMenu.appendChild(li)
            })

            mediaPlayer.source = playlist

            bar.querySelector('.glyphicon-play').parentNode.addEventListener('click', () => {
                mediaPlayer.play()
            })
            bar.querySelector('.glyphicon-pause').parentNode.addEventListener('click', () => {
                mediaPlayer.pause()
            })
            bar.querySelector('.glyphicon-forward').parentNode.addEventListener('click', () => {
                drop.selectedIndex++
                mediaPlayer.source.moveNext()
            })
            bar.querySelector('.glyphicon-backward').parentNode.addEventListener('click', () => {
                drop.selectedIndex--
                mediaPlayer.source.movePrevious()
            })
        })

    document.querySelector('#menu-toggle').addEventListener('click', (e) => {
        e.preventDefault()
        document.querySelector('#wrapper').classList.toggle('toggled')
    })

    document.querySelector('.dropdown-menu').addEventListener('click', ({ target }) => {
        if (target.msMatchesSelector('li a')) {
            let index = 0
            let node = target.parentNode
            while ((node = node.previousElementSibling)) index++
            drop.selectedIndex = index
        }
    })
})
