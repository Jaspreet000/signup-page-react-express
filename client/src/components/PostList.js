import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'tailwindcss/tailwind.css';
import '../App.css'

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://signup-page-react-express.onrender.com/posts?_limit=10&_page=${page}`, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching protected resource:', error.response.data.message);
            return [];
        }
    };

    useEffect(() => {
        const loadPosts = async () => {
            const newPosts = await fetchPosts(page);
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            if (newPosts.length === 0 || newPosts.length < 10) {
                setHasMore(false);
            }
        };

        loadPosts();
    }, [page]);

    const fetchMorePosts = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <div className="bg-purple-100 min-h-screen py-10">
            <div className="mx-auto px-4">
                <h1 className="text-4xl font-bold text-center colorrr mb-8">Posts</h1>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMorePosts}
                    hasMore={hasMore}
                    loader={<div className="text-center text-gray-600">Loading...</div>}
                    endMessage={<p className="text-center text-gray-600">No more posts</p>}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gapp padin">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white shadow-lg rounded-lg p-6 h-full flex flex-col justify-between">
                                <img src={post.image} alt={post.title} className="w-full h-48 object-cover mb-4 rounded-lg" />
                                <div className="flex flex-col flex-grow">
                                    <h2 className="text-2xl font-bold color-text-desc mb-2">{post.title}</h2>
                                    <p className="color-img-below text-justify flex-grow">{post.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default PostList;
