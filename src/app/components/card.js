import React, {memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useDispatch} from "react-redux";
import  slice from "../sagaSlice";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const Figure = styled.figure`
  position: relative;
  display: flex;
  flex-direction: column;

  & img{
    width: ${props => props.isFullscreen ? 'auto' : '100%'} ;
  }
  
   & > span:first-child {
     color: red;
     position: absolute;
     right: 0.3em;
     top: 0.3em;
   }
`;

const FullScreenContent = styled(FullScreen)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
`;

const Figcaption = styled.figcaption`
  display: flex;
  justify-content: center;
  justify-content: space-between;
  
  & > span:first-child {
     font-size: 1vw;
   }
  
  & > span:nth-child(2) {
    padding: 0.3em;
     color: blue;
   }
  
  & [contenteditable="true"]:active, [contenteditable="true"]:focus{
    color: blue;
    border:none;
    outline:none;
  }
`;

function Card(props) {

    const {photo} = props;
    const dispatch = useDispatch();
    const photoCaptureRef = useRef();
    const [isEditable, setIsEditable] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handle = useFullScreenHandle();

    useEffect(() => {
        setIsFullscreen(document.webkitIsFullScreen);
    });

    const switchIsEditable =(state) => {
        setIsEditable(state);
        photoCaptureRef.current.contentEditable = state;
        state && photoCaptureRef.current.focus();
    };

    const onDeleteHandler = (e) => {
        if(photo.id <= 5000) {
            dispatch(slice.actions.delete(photo.id));
        }
    };

    const onEditHandler = (e) => {
        switchIsEditable(true);
    };

    const onSaveHandler =(e) => {
        const title = photoCaptureRef.current?.innerHTML;
        if(photo.id <= 5000 && photo.title !== title){
            dispatch(slice.actions.save({...photo, ...{title}}));
        }
        switchIsEditable(false);
    };

    const handleImageLoaded =(e) => {
        setIsImageLoaded(true);
    };

    const openFullScreenHandler =(e) => {
        console.log("openFullScreenHandler",photo.id);
        if(isFullscreen){
            handle.exit();
        } else handle.enter();
    };


    console.log("Card RENDER",photo.id);
    return (
        <>
            <Figure isFullscreen={isFullscreen} >
                { isImageLoaded && <span className='bi bi-trash' onClick={onDeleteHandler}></span> }
                <FullScreenContent handle={handle}>
                    <img  onClick={openFullScreenHandler} onLoad={handleImageLoaded}
                               alt={`image_${photo.id}`} src={isFullscreen ? photo.url : photo.thumbnailUrl}/>
                </FullScreenContent>
                { isImageLoaded &&
                    <Figcaption>
                        <span ref={photoCaptureRef} >{photo.title}</span>
                        { isEditable ?
                            <span  className='bi bi-save' onClick={onSaveHandler}></span> :
                            <span  className='bi bi-pencil' onClick={onEditHandler}></span>
                        }
                    </Figcaption>
                }
            </Figure>
        </>
    );
}
export default memo(Card);
