import React from 'react';
import {useSelector} from "react-redux";


const Pagination = (props) => {

    const { currentAlbumId = 1, maxPageLimit, minPageLimit, /*totalPages, data*/ } = props;
    const {data, totalAmount} = useSelector(state => state.album);


    return (
        <div> </div>
    )
}

export default Pagination;