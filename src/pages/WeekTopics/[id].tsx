import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setPosts } from '../../store/userSlice';
import Post from '../../components/Post';
import { Container } from './styles';
import data from '../../data/db.json';

const WeekTopicsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.user.posts);
  const { id } = useParams();
  const weekId = Number(id);

  useEffect(() => {
    const weekPosts = data.posts.filter(post => post.week === weekId);
    dispatch(setPosts(weekPosts));
  }, [dispatch, weekId]);

  return (
    <Container>
      <h1>Week {id} topics</h1>

      {posts.length > 0 ? (
        posts.map(post => (
          <Link key={post.id} to={`/topics/topic/${post.id}`}>
            <Post
              id={post.id}
              author={post.author}
              authorId={post.authorId}
              date={post.date}
              week={post.week}
              title={post.title}
              content={post.content}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              answerCount={post.answers.length}
            />
          </Link>
        ))
      ) : (
        <p>There are no topics yet this week.</p>
      )}
    </Container>
  );
};

export default WeekTopicsPage;
