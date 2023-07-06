/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/Components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: true,
    theme: {
        screens: {
            mobile: "640px",
            tablet: "768px",
            laptop: "1024px",
            desktop: "1280px",
        },
    extend: {
        colors: {
            blue: {
                white: '#F5EFE7',
                skin: '#D8C4B6',
                main: '#4F709C',
                dark: '#213555'
            },
        },
        whitespace: ['responsive', 'hover'],
        fontFamily: {
            common: ['Pretendard','sans-serif'],
            },
        },
    },
    plugins: [],
}
