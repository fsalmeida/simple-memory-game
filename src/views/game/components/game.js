import React, { useState, useEffect } from 'react'
import './game.scss'
import shuffle from '../../../utils/shuffle'
import Card from './card'
import GameInfo from './gameInfo'
import Modal from 'react-bootstrap/Modal'

export default (props) => {

    const numberOfItemsPerGame = 15
    const lockTimeInMilliseconds = 1500
    const [items, setItems] = useState([])
    const [firstOpenedItem, setFirstOpenedItem] = useState(null)
    const [isLocked, setIsLocked] = useState(false)
    const [foundCount, setFoundCount] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [isVictory, setIsVictory] = useState(false);

    const setNewGame = _ => {
        let items = []
        const itemTemplate = {
            isOpened: false,
            isMatch: false,
            isUnmatch: false
        }

        let currentGameFiles = shuffle(props.files).slice(0, numberOfItemsPerGame)
        currentGameFiles.forEach((file, index) => {
            items.push({ ...itemTemplate, file: file, id: index, uniqueId: `1-${index}` })
            items.push({ ...itemTemplate, file: file, id: index, uniqueId: `2-${index}` })
        })
        items = shuffle(items)

        setItems(items)
        setFirstOpenedItem(null)
        setIsLocked(false)
        setFoundCount(0)
        setAttempts(0)
        setIsVictory(false)
    }

    const cardToggle = uniqueId => {
        if (isLocked)
            return

        if (!firstOpenedItem)
            openFirstItem(uniqueId)
        else
            checkOpenedItems(uniqueId)
    }

    const updateItem = (items, currentItem, updatedItem) => {
        const itemIndex = items.indexOf(items.find(x => x.uniqueId == currentItem.uniqueId))
        const updatedItems = [...items]
        updatedItems.splice(itemIndex, 1, updatedItem)

        return updatedItems
    }

    const openFirstItem = uniqueId => {
        const correspondingItem = items.find(item => item.uniqueId == uniqueId)
        const updatedItem = { ...correspondingItem, isOpened: true }

        let updatedItems = updateItem(items, correspondingItem, updatedItem)
        setItems(updatedItems)
        setFirstOpenedItem(updatedItem)
    }

    const checkOpenedItems = uniqueId => {
        setAttempts(attempts + 1)

        const correspondingItem = items.find(item => item.uniqueId == uniqueId)
        const isMatch = correspondingItem.id == firstOpenedItem.id

        let updatedItem;
        let updatedFirstOpenedItem;

        if (isMatch) {
            updatedItem = { ...correspondingItem, isMatch: true }
            updatedFirstOpenedItem = { ...firstOpenedItem, isOpened: false, isMatch: true }
            checkVictory()
        }
        else {
            updatedItem = { ...correspondingItem, isOpened: false, isUnmatch: true }
            updatedFirstOpenedItem = { ...firstOpenedItem, isOpened: false, isUnmatch: true }
            setIsLocked(true)
            setTimeout(_ => closeUnmatchedItems(updatedItem, updatedFirstOpenedItem), lockTimeInMilliseconds)
        }

        let updatedItems = updateItem(items, correspondingItem, updatedItem)
        updatedItems = updateItem(updatedItems, firstOpenedItem, updatedFirstOpenedItem)
        setItems(updatedItems)
        setFirstOpenedItem(null)
    }

    const closeUnmatchedItems = (firstItem, secondItem) => {
        let updatedFirstItem = { ...firstItem, isUnmatch: false }
        let updatedSecondItem = { ...secondItem, isUnmatch: false }

        let updatedItems = updateItem(items, firstItem, updatedFirstItem)
        updatedItems = updateItem(updatedItems, secondItem, updatedSecondItem)
        setItems(updatedItems)
        setIsLocked(false)
    }

    const checkVictory = _ => {
        const updatedFoundCount = foundCount + 1
        if (updatedFoundCount == numberOfItemsPerGame) {
            setIsLocked(true)
            setIsVictory(true)
            setTimeout(setNewGame, 5000)
        }
        else
            setFoundCount(updatedFoundCount)
    }

    const cards = items.map(item => (<Card key={item.uniqueId} {...item} toggle={cardToggle} />))

    useEffect(() => {
        setNewGame()
    }, [])

    return (
        <>
            <GameInfo attempts={attempts} foundCount={foundCount} total={numberOfItemsPerGame} />
            <div className="game-container">
                <div className="container">
                    <div className="row">
                        {cards}
                    </div>
                </div>
            </div>

            <Modal show={isVictory}>
                <Modal.Header closeButton>
                    <Modal.Title>Parabéns, você ganhou!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <center>
                        <img className="winnerImg" src="../../../../winner.png"></img>
                    </center>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    )
}