// Logo Component using the eye-shaped TopSeen logo

// Logo Component
export function Logo() {
  return (
    <a
      href="https://www.topseen.co"
      target="_blank"
      className="group text-lg font-semibold ml-auto justify-center gap-2 hidden lg:flex lg:absolute top-4 right-4 items-center"
    >
      <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        > 
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M99.9994 153.877C141.147 153.877 176.851 127.54 194.627 111.673C201.789 105.28 201.789 94.597 194.627 88.204C176.851 72.3371 141.147 46 99.9994 46C58.8516 46 23.1479 72.3371 5.37163 88.2041C-1.79055 94.597 -1.79054 105.28 5.37164 111.673C23.1479 127.54 58.8516 153.877 99.9994 153.877ZM99.9994 137.57C120.783 137.57 137.631 120.722 137.631 99.9383C137.631 79.1551 120.783 62.3069 99.9994 62.3069C79.2161 62.3069 62.368 79.1551 62.368 99.9383C62.368 120.722 79.2161 137.57 99.9994 137.57Z" 
            fill="white"
          /> 
        </svg>
        <span className="font-bold text-xl">TopSeen</span>
      </div>
    </a>
  );
}
