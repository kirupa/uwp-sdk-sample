﻿'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const overflow = (n, min, max) => {
        const range = max - min + 1
        let mod = (n - min) % range
        if (mod < 0) {
            mod += range
        }
        return min + mod
    }

    // Detect WinRT support.
    if (typeof Windows === 'undefined') {
        document.querySelector('#store-badge').classList.toggle('hide')
        document.querySelector('#winrt-alert').classList.toggle('hide')
    }
    // Setup event listeners for page wrapper.
    const pageWrapper = document.querySelector('#wrapper')
    document.querySelector('#menu-toggle').addEventListener('click', (e) => {
        e.preventDefault()
        pageWrapper.classList.toggle('toggled')
    })

    // Enhance Boostrap dropdown menus.
    Array.from(document.querySelectorAll('.dropdown')).forEach((list) => {
        const listMenu = list.querySelector('.dropdown-menu')
        const listItems = listMenu.getElementsByTagName('li')
        const listLabel = list.querySelector('.dropdown-toggle')

        let selectedIndex = -1
        Object.defineProperty(list, 'selectedIndex', {
            configurable: true,
            enumerable: true,
            get() {
                return selectedIndex
            },
            set(index) {
                const lastIndex = Math.max(0, listItems.length - 1)
                selectedIndex = overflow(index, 0, lastIndex)
                const { innerText } = listItems[selectedIndex]
                listLabel.innerHTML = `${innerText} <span class="caret"></span>`
            }
        })

        listMenu.addEventListener('click', ({ target }) => {
            if (target.msMatchesSelector('li a')) {
                let index = 0
                let node = target.parentNode
                while ((node = node.previousElementSibling)) index++
                list.selectedIndex = index
            }
        })
    })
})
