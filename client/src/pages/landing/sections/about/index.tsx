// Images
import aboutImage from '../../../../assets/images/about/about-img.jpg';
import signature from '../../../../assets/images/about/signature.svg';

// Styles
import './style.css';

// utils
import { markdownToHTML } from '../../../../utils/converter';

// Data
import aboutData from '../../../../data/about.json';

// -----------------------

function About() {
  return (
    <section id="about" className="section">
      <h2 className="title">{aboutData.title}</h2>
      <div className="section-des">{aboutData.description}</div>

      <div className="content-670">
        <p
          dangerouslySetInnerHTML={{
            __html: markdownToHTML(aboutData.paragraphe1),
          }}></p>
      </div>

      <img
        className="about-img block-right"
        src={aboutImage}
        alt="about image"
      />

      <ul className="about-info">
        {aboutData.aboutInfo.map((info, i: number) => (
          <li key={'about-info-' + i}>
            <h6>{info.title}</h6>
            {info?.text ? (
              <span>{info.text}</span>
            ) : info?.link ? (
              <a href={info?.link?.to}>{info?.link?.text}</a>
            ) : (
              <div></div>
            )}
          </li>
        ))}
      </ul>

      <div className="about-text content-670">
        {aboutData.paragraphes.map((text: string, i: number) => (
          <p
            key={'about-p' + i}
            dangerouslySetInnerHTML={{
              __html: markdownToHTML(text),
            }}></p>
        ))}
      </div>

      <img className="signature" src={signature} alt="signature" />
    </section>
  );
}

export default About;
