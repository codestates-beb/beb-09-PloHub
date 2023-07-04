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
        backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
            'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
    fontFamily: {
        common: ['Pretendard','sans-serif'],
        },
    },
    },
    plugins: [],
}
