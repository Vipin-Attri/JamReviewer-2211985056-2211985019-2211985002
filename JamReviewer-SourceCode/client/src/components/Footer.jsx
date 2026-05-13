import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          Developed with <Heart size={14} className="heart-icon" /> by Vipin Attri
        </p>
        <p className="footer-powered">
          Powered by{' '}
          <a
            href="https://www.kalawatiputra.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            KalawatiPutra Edu
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
