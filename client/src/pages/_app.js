import '@/styles/globals.css'
import HeadMeta from '../Components/Common/HeadMeta'

export default function App({ Component, pageProps }) {
    return (
        <>
            <HeadMeta />
            <Component {...pageProps} />
        </>
    )
}
