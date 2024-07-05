import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setCurrentUserPosts } from '../../store/userSlice'; // Import fetchUsers

import { FaCalendar } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

import Post from '../../components/Post';
import data from '../../data/db.json';
import NotFoundPage from '../NotFound';

import { Container, ProfileHeader, UserInfo, UserPhoto } from './styles';
import { SkeletonPost } from '../../components/Loading';

import { formatDate } from '../../utils/formatDate';

interface User {
  id: string;
  name: string;
  photoUrl: string;
  bio: string;
  createdAt: string;
  postsId: { id: string }[];
}

function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.user.currentUserPosts);
  const users = useSelector((state: RootState) => state.user.users);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const foundUser = users.find(user => user.id === id);
    setUser(foundUser);

    if (foundUser) {
      const userPostIds = foundUser.postsId.map(post => post.id);
      const userPosts = data.posts.filter(post => userPostIds.includes(post.id));
      dispatch(setCurrentUserPosts(userPosts));
    } else {
      dispatch(setCurrentUserPosts([]));
    }

    setLoading(false);
  }, [dispatch, id, users]);

  if (loading) {
    return (
      <main>
        <SkeletonPost quantity={1} />
      </main>
    );
  }

  if (!user) {
    return (
      <NotFoundPage />
    );
  }

  return (
    <Container>
      <ProfileHeader>
        <div className="photo">
          <UserPhoto>
            {
              user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} />
              ) : (
                <div className='no-photo'></div>
              )
            }
          </UserPhoto>
        </div>
        <UserInfo>
          <h1>{user.name}</h1>
          <p>{user.bio}</p>
          <div>
            <div>
              <FaCalendar size={14} />
              <span>Joined on {formatDate(user.createdAt)}</span>
            </div>
            <div>
              <FaMessage />
              <span>{user.postsId.length} topics</span>
            </div>
          </div>
        </UserInfo>
      </ProfileHeader>

      {posts.map(post => (
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
      ))}
    </Container>
  );
}

export default ProfilePage;