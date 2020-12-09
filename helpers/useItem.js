import { useState, useEffect } from 'react'

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function getItemBasicInfo() {
    const href = window.location.href
    const parts = href.split('/')
    const list = capitalize(parts[parts.length - 2].slice(0, -1))

    let slug = window.document.getElementById('ks-input-slug')

    return {
        list,
        slug,
    }
}

export function useItem() {
    const [itemBasicInfo, setItemBasicInfo] = useState(getItemBasicInfo())

    useEffect(() => {
        function handleClick() {
            console.log('useEffect')
            setItemBasicInfo(getItemBasicInfo())
        }

        window.addEventListener('click', handleClick)

        return () => window.removeEventListener('click', handleClick)
    }, [])

    return itemBasicInfo
}
