import React, { useState } from 'react';
import axios from 'axios';

// Images
import mapImg from '../../../../assets/images/contact/map.png';

// Styles
import './style.css';

// utils
import { markdownToHTML } from '../../../../utils/converter';

// Data
import contactData from '../../../../data/contact.json';

// ----------------

type formDataType = {
  'your-name': string;
  'your-email': string;
  'your-subject': string;
  'your-message': string;
};
const initialFormData = {
  'your-name': '',
  'your-email': '',
  'your-subject': '',
  'your-message': '',
};

// to handle sending form message
type serverStateType = {
  submitting: boolean;
  status?: {
    ok: boolean;
    msg: string;
  } | null;
};

function Contact() {
  const [formData, setFormData] = useState<formDataType>(initialFormData);
  const [serverState, setServerState] = useState<serverStateType>({
    submitting: false,
    status: null,
  });

  /**
   * Change {formData} variable when user input data
   *
   * @param e change event in form inputs
   */
  const handleDataChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Handle the http request we sent to send our message (that user wrote)
   * and give message to the user to know what happened, is the message sent or not.
   *
   * @param ok if message has been sent or not
   * @param msg the message to be shown to the user
   */
  const handleServerResponse = (ok: boolean, msg: string) => {
    setServerState({
      submitting: false,
      status: { ok, msg },
    });
    if (ok) {
      setFormData(initialFormData);
    }
    setTimeout(() => {
      setServerState((prev: serverStateType) => ({ ...prev, status: null }));
    }, 3000);
  };

  /**
   * Submitting message when user clock send button
   *
   * @param e form submit event
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Submitting Form
    setServerState({ submitting: true });
    axios({
      method: 'post',
      url: contactData.formspreeEndpoint,
      data: formData,
    })
      .then((r) => {
        handleServerResponse(true, 'Message Has Been Send');
      })
      .catch((r) => {
        handleServerResponse(false, 'Error occuars while sending');
      });
  };

  return (
    <section id="contact" className="section">
      <h2 className="title">{contactData.title}</h2>
      <div className="section-des">{contactData.description}</div>
      <div className="content-670">
        <p
          dangerouslySetInnerHTML={{
            __html: markdownToHTML(contactData.paragrapge),
          }}></p>
      </div>

      

      <div className="content-670">
        <div className="contact-form">
          <form action="#" method="post" onSubmit={handleSubmit}>
            <p>
              <input
                id="name"
                type="text"
                name="your-name"
                placeholder="NAME"
                pattern="(?!.^\s$)[A-Za-z]{3,}"
                required
                value={formData['your-name']}
                onChange={handleDataChange}
              />
            </p>
            <p>
              <input
                id="contact-email"
                type="email"
                name="your-email"
                placeholder="EMAIL"
                pattern="(?=.*[a-zA-Z])[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,}"
                required
                value={formData['your-email']}
                onChange={handleDataChange}
              />
            </p>
            <p>
              <input
                id="subject"
                type="text"
                name="your-subject"
                placeholder="SUBJECT"
                pattern="(?!.^\s$)[A-Za-z]{3,}"
                required
                value={formData['your-subject']}
                onChange={handleDataChange}
              />
            </p>
            <p>
              <textarea
                id="message"
                name="your-message"
                placeholder="MESSAGE"
                required
                value={formData['your-message']}
                onChange={handleDataChange}></textarea>
            </p>
            <p className="contact-submit-holder">
              <input type="submit" value="SEND" />
            </p>

            {(serverState.submitting || serverState.status?.msg) && (
              <p className="respond-message">
                {serverState.submitting
                  ? 'Sending message'
                  : serverState.status
                  ? serverState.status?.msg
                  : ''}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
