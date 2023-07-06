import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    SET_ACCOUNT,
    SET_NICKNAME,
    SET_LEVEL,
    SET_TOKEN_BALANCE,
    SET_ETH_BALANCE
} from './ActionTypes';

const initialState = {
    user: {
        account: '',
        nickname: '',
        level: '',
        tokenBalance: '',
        ethBalance: '',
    },
};

const demoUser = {
    account: 'test@test.com',
    nickname: 'Test User',
    level: '2',
    tokenBalance: '15',
    ethBalance: '1.5',
}

/**
 * 계정 설정 액션 생성자.
 *
 * @param {string} account - 설정할 계정.
 * @returns {Object} 액션 객체.
 */
// account를 인자로 받고 type이 SET_ACCOUNT이고, 
// payload가 인자로 받은 account인 액션 객체를 반환한다.
export const setAccount = (account) => ({
    type: SET_NICKNAME,
    payload: account,
});

/**
 * 사용자 리듀서. 이전 상태와 액션을 인자로 받아 새 상태를 반환.
 *
 * @param {Object} [state=initialState] - 이전 상태.
 * @param {Object} action - 액션 객체.
 * @returns {Object} 새 상태.
 */
export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACCOUNT:
            return {
                ...state,
                user: {
                    ...state.user,
                    account: action.payload
                }
            }
        case SET_NICKNAME:
            return {
                ...state,
                user: {
                    ...state.user,
                    nickname: action.payload
                }
            }
        case SET_LEVEL:
            return {
                ...state,
                user: {
                    ...state.user,
                    level: action.payload
                }
            }
        case SET_TOKEN_BALANCE:
            return {
                ...state,
                user: {
                    ...state.user,
                    tokenBalance: action.payload
                }
            }
        case SET_ETH_BALANCE:
            return {
                ...state,
                user: {
                    ...state.user,
                    ethBalance: action.payload
                }
            }
        default:
            return state;
    }
};

const mergedInitialState = {
    ...initialState,
    user: {
        ...initialState.user,
        ...demoUser
    }
};

/**
 * Redux 스토어는 애플리케이션의 상태를 저장하는 객체, createStore 함수를 사용하여 생성
 * DevTools 확장 프로그램은 개발 도구에서 Redux 상태 및 액션을 시각적으로 추적하는 데 사용.
 *
 * @type {Object}
 */
// export const store = createStore(userReducer, mergedInitialState, composeWithDevTools());
export const store = createStore(userReducer, composeWithDevTools());
