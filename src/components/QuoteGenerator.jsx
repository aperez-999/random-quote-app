import React, { useState, useEffect } from 'react';
import './QuoteGenerator.css';

const QuoteGenerator = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const API_KEY = 'xF+6oOI82ki3A76rDNiTww==klX01mEc9gX6b8Uj';

  // Fetch quote from API Ninjas
  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        method: 'GET',
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }

      const data = await response.json();
      // API Ninjas returns an array, so we take the first quote
      setQuote(data[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial quote fetch
  useEffect(() => {
    fetchQuote();
  }, []);

  // Copy quote to clipboard
  const handleCopyQuote = () => {
    if (quote) {
      navigator.clipboard.writeText(`"${quote.quote}" - ${quote.author}`);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  // Share on Twitter with improved popup
  const handleTweetQuote = () => {
    if (quote) {
      const tweetText = encodeURIComponent(`"${quote.quote}" - ${quote.author}`);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
      
      // Open Twitter in a new window with specific dimensions
      window.open(
        twitterUrl, 
        'twitter-share-dialog', 
        'width=626,height=436'
      );
    }
  };

  return (
    <div className="quote-generator-container">
      <div className="quote-card">
        {loading ? (
          <p className="loading">Loading quote...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : quote ? (
          <div className="quote-content">
            <blockquote className="quote-text">
              "{quote.quote}"
            </blockquote>
            <cite className="quote-author">- {quote.author}</cite>
            <div className="quote-category">
              Category: {quote.category}
            </div>
          </div>
        ) : null}

        <div className="quote-actions">
          <button 
            onClick={fetchQuote} 
            disabled={loading}
            className="btn btn-refresh"
          >
            ↻ New Quote
          </button>
          <button 
            onClick={handleCopyQuote} 
            disabled={loading}
            className="btn btn-copy"
          >
            📋 Copy
          </button>
          <button 
            onClick={handleTweetQuote} 
            disabled={loading}
            className="btn btn-tweet"
          >
            𝕏 Tweet
          </button>
        </div>

        {copiedNotification && (
          <div className="copied-notification">
            Quote copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteGenerator;