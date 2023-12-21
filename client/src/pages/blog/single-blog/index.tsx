// Images
import previewImage from '../../../assets/images/blog/img-single-blog.jpg';
import quoteImg from '../../../assets/images/blog/quote.svg';

// Styles
import './style.css';

// ----------------------

function BlogSingle() {
  return (
    <section className="single-blog section">
      <div className="container-wrap">
        {/* Blog TItle */}
        <h1 className="entry-title">Make it simple but significant</h1>

        {/* sub info about the blog (date, category, author) */}
        <ul className="meta">
          <li className="author">JACOB</li>
          <li className="date">NOV 9, 2020</li>
          <li className="category">
            <a href="#">BRANDING</a>
          </li>
        </ul>

        <div className="content-670">
          <p>
            Dolor sit amet, consectetur adipiscing elit. Viverra tristique
            placerat in massa consectetur quisque. Nunc ac fames lectus in
            libero aliquet lorem ipsum dolor sit amet enim est urus tincidunt
            magna ut turpis eu, eu enim. Nisl porttitor elit risus velit urna
            morbi mauris.
          </p>
        </div>

        <div className="thumbnail-img block-right">
          <img src={previewImage} alt="blog preview image" />
        </div>

        <div className="content-670">
          <p>
            Nam ultrices ultrices nec tortor pulvinar fermentum mi. Sociis sit
            tristique sagittis, mauris volutpat estera phasellus. Varius nec
            orci, quam augue lorem lines pellentesque non id. Tristique amet
            volutpat nunc euismod. Mauris felis at quam sollicitudin est sempe
            vulputate id in nullam. Purus tincidunt maga ut turpis eu, eu enim.
            Nisl porttitor elit risus velit urna morbit mauris at proin laoreet
            lobortis urna aliquam setera fermentum sit iaculis vitae hendrerit
            et. Arcu ac est dictum lorem ispum dolor sit amet nunc estera per se
            usrus seio.
          </p>
          <div className="clearfix"></div>

          <blockquote>
            <img src={quoteImg} alt="" />
            <p>
              Viverra tristique place rat sat massa consect ur quisque nunc
              fames lectus in libero aliquet ertare fera est lorem nunc dolor
              sit amet erale aces volutpat.
            </p>
          </blockquote>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra
            tristique placerat sat massa consectetur quisque nunc fames lectus
            in libero aliquet ertare fera est lorem nunc dolor sit amet
            setterale aces volutpat in voltare lupar aes llus.
          </p>

          <p>
            Faucibus sed tristique fames sed aliquet ultricies eget viverra
            arcu. Vitae faucibus diam consequat aecenas. Turpis metus sit diam
            purus leo in varius ac quam nun amet sei tristique set volutpat
            vulputateest phasellus. Volutpat faucibus per ame aced no nuncare
            voltare per settera lore.
          </p>

          <p>
            Nam ultrices ultrices nec tortor pulvinar fermentum mi. Sociis sit
            tristique sagittis, mauris volutpat estera phasellus. Varius nec
            orci, quam augue lorem lines pellentesque non id. Tristique amet
            volutpat nunc euismod. Mauris felis at quam sollicitudin est sempe
            sa vulputate id in nullam. Purus tincidunt maga ut turpis eu, eu
            enim. Nisl porttitor elit risus velit urna morbit mauris at proin
            laoreet lobortis urna aliquam setera per senarre.
          </p>

          <ul className="soc-list">
            <li>
              <a href="#">TW.</a>
            </li>
            <li>
              <a href="#">IN.</a>
            </li>
            <li>
              <a href="#">FB.</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BlogSingle;
