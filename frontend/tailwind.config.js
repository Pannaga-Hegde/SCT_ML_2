/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        primary: '#6366F1', // Premium Indigo
        accent: '#0EA5E9',  // Sky accent
        success: '#10B981', // Emerald success
        danger: '#EF4444',  // Red danger
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 8px 30px rgb(0,0,0,0.04)',
        'apple-hover': '0 20px 40px rgb(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
