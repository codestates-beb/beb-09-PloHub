import Head from 'next/head';
import { logoWhite } from '../Reference';

const HeadMeta = () => {

    return (
        <Head>
            <title>PloHub</title>
            <meta
            name="description"
            content={
                "집정리가 필요한 고객에게 정리전문가를 연결하고 정리습관을 만드는 대표 집정리 플랫폼 클린테크 기업"
            }
            />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta property="og:title" content={ "정리습관"} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={ "https://jungleehabit.com"} />
            <meta property="og:image" content={logoWhite} />
            <meta property="og:article:author" content="정리습관" />
        </Head>
    )
}

export default HeadMeta;