/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";

export default function HelmetIdentify({ title, keywords, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}
