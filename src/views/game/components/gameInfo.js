import React from 'react'

export default (props) => {

    return (
        <div className="game-info">
            Encontrados: {props.foundCount}/{props.total} |
            Tentativas: {props.attempts}
        </div>
    )
}