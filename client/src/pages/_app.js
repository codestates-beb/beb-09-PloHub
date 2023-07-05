import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import { store } from '../Components/Redux/store'
import '@/styles/globals.css'
import HeadMeta from '../Components/Common/HeadMeta'

function App({ Component, pageProps }) {
    return (
        // Provider 컴포넌트는 React 컴포넌트 트리에서 Redux 스토어를 사용할 수 있게 하는 역할
        // Provider 컴포넌트로 감싸서 모든 컴포넌트가 Redux 스토어에 접근 할 수 있게 함
        <Provider store={store}>
            <HeadMeta />
            <Component {...pageProps} />
        </Provider>
    )
}

const makestore = () => store;

// Redux 스토어를 Next.js 앱에 연결하는 데 사용
// 이 함수는 서버 사이드 렌더링에 필요한 설정을 처리
const wrapper = createWrapper(makestore);       

// App 컴포넌트를 감싸 Next.js 앱이 Redux 스토어와 함께 렌더링되게 된다.
// 이 스토어는 서버 사이드 렌더링을 지원하게 된다.
export default wrapper.withRedux(App);
