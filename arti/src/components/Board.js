import React, { useContext } from 'react'
import {
  Card,
  Col,
  Image,
  useAccordionButton,
  Accordion,
} from 'react-bootstrap'
import styles from '../styles/components/board.module.css'
import { BoardsStateContext } from '../pages/MyBoards'
import { bufferToBase64 } from '../utils/BufferToBase64.js'
import BoardExpand from '../components/BoardExpand'

export default function Board({ board, boardIndex, callback }) {
  const { setSelectedBoard } = useContext(BoardsStateContext)
  const { boardName } = board

  // uses react-bootstrap accordion stuff
  const expander = useAccordionButton(
    boardIndex,
    () => callback && callback(boardIndex)
  )

  return (
    <Col xs={12} md={6} lg={4} className={`${styles.board}`}>
      <Accordion>
        <div className={`my-2 ${styles['board-container']}`}>
          <button
            className={styles['board-btn']}
            onClick={() => {
              setSelectedBoard(boardIndex)
              expander()
            }}
          >
            <Card className={`${styles['board-card']}`}>
              <Card.Body>
                <Card.Title className='pb-3 d-flex justify-content-between'>
                  <h5>{boardName}</h5>
                  <h5>{board.images.length}</h5>
                </Card.Title>

                {board.thumbnail ? (
                  <Image
                    className={`${styles.thumbnail}`}
                    src={`data:image/jpeg;base64,${bufferToBase64(
                      board.thumbnail.data.data
                    )}`}
                    rounded={true}
                    key={boardName}
                    loading='lazy'
                  />
                ) : (
                  <>No Images Yet</>
                )}
              </Card.Body>
            </Card>
          </button>
        </div>

        <Accordion.Collapse eventKey={boardIndex}>
          <BoardExpand
            board={board}
            boardIndex={boardIndex}
            key={boardName}
          ></BoardExpand>
        </Accordion.Collapse>
      </Accordion>
    </Col>
  )
}
