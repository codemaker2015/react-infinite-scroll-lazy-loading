import React from 'react';
import './image.css';

const ImageComponent = ({ src }) => {
	return <img src={src} alt='Avatar' className='card-img' />;
};

export default ImageComponent;
