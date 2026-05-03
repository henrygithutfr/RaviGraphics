// Frontend/src/assets/components/SEO.jsx
import { Helmet } from "react-helmet-async";

export default function SEO({ title, description }) {
  const siteName = "Ravi Graphics";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  
  // Same keywords for EVERY page
  const keywords = "printing services Odisha, graphic design services Odisha, business card printing, brochure printing, banner printing, flex printing, sticker printing, poster printing, custom printing India, Ravi Graphics";
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}