import { Link as RouterLink } from 'react-router-dom';

// Styles
import './style.css';

// Data
import blogData from '../../.././../data/blog.json';

// -------------

function Blog() {
  /**
   * Returning window to (0 position) when going to single blog page
   */
  const handleClick = () => {
    window.scroll(0, 0);
  };

  return (
    <section id="blog" className="section">
      <h2 className="title">{blogData.title}</h2>
      <div className="section-des">{blogData.description}</div>

      <ul className="home-blog-list">
        {blogData.posts.map((post, i: number) => (
          <li key={'blog-post' + i}>
            <RouterLink to={post.to} onClick={handleClick}>
              {post.title}
            </RouterLink>

            <div className="blog-list-info">
              <div className="date">{post.date}</div>
              <div className="category">{post.category}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Blog;
