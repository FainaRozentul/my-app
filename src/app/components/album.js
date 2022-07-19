import React, {memo, useEffect, useState} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import  slice from "../sagaSlice";
import Card from "./card";
import UploadPhoto from "./uploadPhoto";
import _uniqueId from 'lodash/uniqueId';

const Wrapper = styled.div`
  display:flex;
  flex-direction: column;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(5,20%);
`;

const Title = styled.h2`
  display:flex;
  justify-content: center;
`;

function Album() {

    const dispatch = useDispatch();
    const {data, totalAmount, isFetching, error} = useSelector(state => state.album);

    useEffect(() => {
        console.log("Album MOUNTED", totalAmount);
        dispatch(slice.actions.fetch());
    },[]);

    console.log("Album RENDER", totalAmount);
    return (
        <Wrapper>
            <Title>Album Manage Client</Title>
            <UploadPhoto/>
             <List>
                { data?.map(photo => (<Card key={photo.id > 5000 ? +_uniqueId() + photo.id : photo.id}  photo={photo}/>)) }
            </List>
        </Wrapper>
    );
}

export default memo(Album);