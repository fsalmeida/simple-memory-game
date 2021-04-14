import React from 'react'
import './card.scss'

export default (props) => {
    const closedCardImageUrl = '../../../../closed-card.png'

    const toggle = () => {
        if (!props.isOpened && !props.isMatch && !props.isUnmatch)
            props.toggle(props.uniqueId)
    }

    const cardClassNames = `card col-md-2 ${props.isOpened ? 'open' : ''} ${props.isMatch ? 'match' : ''} ${props.isUnmatch ? 'unmatched' : ''}`

    return (
        <div className={cardClassNames} onClick={toggle}>
            <img src={props.isOpened || props.isMatch || props.isUnmatch ? props.file : closedCardImageUrl} />
        </div>
    )
}