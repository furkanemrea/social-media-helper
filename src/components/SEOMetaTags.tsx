import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  schema?: object;
}

const SEOMetaTags: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image,
  schema
}) => {
  const location = useLocation();
  const currentUrl = window.location.origin + location.pathname;

  const defaultTitle = "Ig-Ghost - View Profiles Without Login";
  const defaultDescription = "View Instagram profiles, posts, stories, and highlights anonymously without logging in. Free Instagram profile viewer tool with no account required.";
  const defaultImage = `${window.location.origin}/og-image.jpg`;

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Ig-Ghost",
    "applicationCategory": "Social Media Tool",
    "description": pageDescription,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      {/* Open Graph Tags */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEOMetaTags; 