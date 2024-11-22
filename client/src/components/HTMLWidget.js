// src/components/HTMLWidget.js
import React, { useState, useEffect } from 'react';
import './HTMLWidget.css';

const HTMLWidget = ({ file, className }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the HTML content dynamically
    fetch(`/api/content?file=${file}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        return response.text();
      })
      .then((html) => setContent(html))
      .catch((err) => setError(err.message));
  }, [file]);

  if (error) {
    return <div className="html-widget-error">{error}</div>;
  }

  return (
    <div
      className={`html-widget ${className}`}
      dangerouslySetInnerHTML={{ __html: content }} // Render raw HTML
    />
  );
};

export default HTMLWidget;
