import '../styles/globals.css';
import SmoothScroll from '../components/SmoothScroll';

export default function App({ Component, pageProps }) {
  return (
    <SmoothScroll>
      <Component {...pageProps} />
    </SmoothScroll>
  );
}
