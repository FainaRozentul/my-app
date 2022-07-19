import React, {memo, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useDispatch} from "react-redux";
import slice from "../sagaSlice";

const Wrapper = styled.form`
  display:flex;
  justify-content: center;
  padding: 2em 
`;

const Button = styled.div`
  display:flex;
  justify-content: center;
  border: 1px solid black;
  border-radius: 3px;
  padding: 0.5em 1em;
`;

function UploadPhoto() {
    const dispatch = useDispatch();
    const uploadFileRef = useRef();

    useEffect(() => {
        console.log("UploadPhoto MOUNTED")
    },[])

    const onUploadHandler = (e) => {
        const photo = e.target.files[0];
        const type = photo?.type;
        if(photo && type?.includes("image/")){
           const reader = new FileReader();
           reader.onloadend = () => {
               dispatch(slice.actions.upload(reader.result));
           }
           reader.readAsDataURL(photo);
        }
    }

    const onClickHandler = (e) => {
        e.preventDefault();
        uploadFileRef.current.click();
    }

    console.log("UploadPhoto RENDER");
    return (
        <Wrapper>
            <Button onClick={onClickHandler}>Upload Photo</Button>
            <input type='file' ref={uploadFileRef} style={{display:'none'}} onChange={onUploadHandler} accept='image/*'/>
        </Wrapper>
    );
}
export default memo(UploadPhoto);
