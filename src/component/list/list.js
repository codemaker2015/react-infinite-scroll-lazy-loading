/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Suspense } from 'react';
import imageFile from './book.png';
import './list.css';
const ImageComponent = React.lazy(() => import('../image/image'));

const List = () => {
	const [listItems, setListItems] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [books, setBooks] = useState([]);
	const [page, setPage] = useState(0);

	useEffect(() => {
		fetchBooks();
		window.addEventListener('scroll', handleScroll);
	}, []);

	const fetchBooks = async () => {
		const key = "y0BvJptePkXJqoGbu7KtZrrARrIT1yrI";
		const result = await fetch(`https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${key}`);
		const data = await result.json();
		if (data.status === 'OK' && data?.results?.lists?.length > 0) {
			let bookList = [];
			data.results.lists.forEach((element) => {
				bookList.push(...element.books);
			});
			setBooks(bookList);
			setListItems(() => {
				return [...listItems, ...bookList?.splice(page * 10, 10)];
			});
		}
	}

	const handleScroll = () => {
		// var div = document.getElementById("div");
		// if(Math.abs(Math.round(div.scrollHeight - div.scrollTop) - div.clientHeight) > 3 || isFetching)
		if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight || isFetching)
			return;
		setIsFetching(true);
	};

	const fetchData = async () => {
		setListItems( [...listItems, ...books?.splice(page * 10, 10)]);
		setPage(page + 1);
		setIsFetching(false);
	};

	useEffect(() => {
		if (!isFetching) return;
		fetchData();
	}, [isFetching]);

	const showBookCard = (listItem) => {
		return (
			<div className='card' key={listItem.id}>
				<div className='book-img'>
					<Suspense fallback={<img src={imageFile} alt='Avatar' style={{ width: '50%' }} />}>
						<ImageComponent src={listItem.book_image} />
					</Suspense>
				</div>
				<div className='book-info'>
					<h1>{listItem.title}</h1>
					<h2>By {listItem.author}</h2>
					<h4>{listItem.description}</h4>
					<h2>ISBN {listItem.primary_isbn10}, {listItem.primary_isbn13}</h2>
					<h3>Published by {listItem.publisher} on {listItem.updated_date}</h3>
					{listItem?.buy_links?.length > 0 && <h3>Buy on 
						{listItem?.buy_links?.map((item)=> {
							return (
								<a style={{margin: '10px'}} href={item.url}>{item.name}</a>
							)
						})}
						</h3> 
					}
				</div>
			</div>
		)
	}

	return (
		<div className='conatiner'>
			<div className='app-title'>VLib - Virtual Library</div>
			<div className='app-subtitle'>My book collections</div>
			{listItems?.length <= 0 ? 
				<div className='loading'>Loading...</div>
			:
			listItems.map((listItem) => (
				showBookCard(listItem)
			))}
			{isFetching && <h1>Fetching more list items...</h1>}
		</div>
	);
};

export default List;
