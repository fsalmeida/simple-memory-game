import React, { useState, useEffect } from 'react'
import './gamePage.scss'
import Game from './components/game'

export default (props) => {

    const [files, setFiles] = useState([])

    const handleOnImagesChanged = (e) => {
        const input = e.target
        if (input.files.length < 15) {
            input.value = null;
            alert('Selecione ao menos 15 imagens.')
            return
        }

        const files = [...input.files].map(file => URL.createObjectURL(file))
        setFiles(files)
    }

    const previewImages = files.map(file => (<img src={file} />))

    return (
        <>
            <h1>Jogo da memória </h1>

            {previewImages.length == 0 &&
                <div className="images">
                    <div className="title">
                        <span>Escolha ao menos 15 imagens para iniciar o jogo</span>
                    </div>
                    <div className="images-input">
                        <input type="file" multiple onChange={handleOnImagesChanged}></input>
                    </div>
                </div>
            }

            {previewImages.length > 0 && <Game {...props} files={files} />}
        </>
    )
}