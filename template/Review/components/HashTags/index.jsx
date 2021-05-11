import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'components/atoms';
import { Wrapper, Title } from './Styled';

const IMAGE_PATH = {
    title: 'static/icons/text/text_favorite_hah'
}


function ReviewHashtag({ hashTags }) {
    return (
        <Wrapper>
            <Title>
                <div><Image src={} /></div>
                <div><Image src={} /></div>
            </Title>
        </Wrapper>
    )
}

ReviewHashtag.propTypes = {

}

export default ReviewHashtag

