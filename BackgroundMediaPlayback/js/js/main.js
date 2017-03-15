//// Copyright (c) Microsoft Corporation. All rights reserved

$(() => {
    'use strict'

    const Uri = Windows.Foundation.Uri
    const MediaSource = Windows.Media.Core.MediaSource
    const MediaPlaybackItem = Windows.Media.Playback.MediaPlaybackItem
    const MediaPlaybackList = Windows.Media.Playback.MediaPlaybackList
    const MediaPlayer = Windows.Media.Playback.MediaPlayer
    const Storage = Windows.Storage

    const mediaPlayer = new MediaPlayer
    mediaPlayer.autoPlay = false

    Storage.StorageFile.getFileFromApplicationUriAsync(new Uri('ms-appx:///assets/playlist.json'))
        .then((storageFile) => Storage.FileIO.readTextAsync(storageFile))
        .then((jsonText) => {
            const menu = $('#dropdownMenu1 + .dropdown-menu')
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

                $(`<li><a href="#">${ object.title }</a></li>`)
                    .click(() => mediaPlayer.source.moveTo(index))
                    .appendTo(menu)
            })

            mediaPlayer.source = playlist
            $('#play-button').on('click', () => mediaPlayer.play())
            $('#pause-button').on('click',() => mediaPlayer.pause())
            $('#next-button').on('click', () => mediaPlayer.source.moveNext())
            $('#prev-button').on('click', () => mediaPlayer.source.movePrevious())
        })

    $('#menu-toggle').on('click', (e) => {
        e.preventDefault()
        $('#wrapper').toggleClass('toggled')
    })

    $('.dropdown-menu').on('click', 'li a', function () {
        const text = $(this).text()
        $(this)
            .parents('.dropdown')
            .find('.dropdown-toggle')
            .html(`${ text } <span class="caret"></span>`)
    })
})
