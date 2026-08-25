export default function ATMMachine() {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Corps principal du GAB */}
        <defs>
          <linearGradient id="atmBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E0" />
          </linearGradient>
        </defs>

        {/* Structure principale */}
        <rect x="50" y="50" width="300" height="500" rx="15" fill="url(#atmBody)" />
        
        {/* Écran principal */}
        <rect x="70" y="100" width="260" height="180" rx="8" fill="url(#screenGradient)" />
        
        {/* Contenu de l'écran - Dashboard */}
        <g transform="translate(80, 110)">
          {/* Header du dashboard */}
          <rect x="0" y="0" width="240" height="25" rx="4" fill="#F7FAFC" />
          <text x="10" y="17" fontSize="10" fill="#F9A825" fontWeight="bold">MobileWallet</text>
          <text x="200" y="17" fontSize="10" fill="#4A5568" fontWeight="bold">Dashboard</text>
          
          {/* Stats */}
          <rect x="0" y="30" width="115" height="40" rx="4" fill="white" />
          <text x="5" y="45" fontSize="8" fill="#718096">Total</text>
          <text x="5" y="60" fontSize="14" fill="#2D3748" fontWeight="bold">87,543.00</text>
          
          <rect x="125" y="30" width="115" height="40" rx="4" fill="white" />
          <text x="130" y="45" fontSize="8" fill="#718096">Transactions</text>
          <text x="130" y="60" fontSize="14" fill="#2D3748" fontWeight="bold">750,000</text>
          
          {/* Graphiques */}
          <rect x="0" y="75" width="115" height="50" rx="4" fill="white" />
          <rect x="5" y="100" width="20" height="20" fill="#F9A825" />
          <rect x="30" y="95" width="20" height="25" fill="#F9A825" />
          <rect x="55" y="90" width="20" height="30" fill="#F9A825" />
          <rect x="80" y="85" width="20" height="35" fill="#F9A825" />
          
          <rect x="125" y="75" width="115" height="50" rx="4" fill="white" />
          <circle cx="140" cy="100" r="8" fill="#2D3748" />
          <circle cx="160" cy="100" r="8" fill="#4A5568" />
          <circle cx="180" cy="100" r="8" fill="#718096" />
          <rect x="195" y="92" width="30" height="16" rx="2" fill="#2D3748" />
        </g>
        
        {/* Clavier */}
        <rect x="100" y="300" width="200" height="120" rx="8" fill="#1A202C" />
        <circle cx="150" cy="340" r="8" fill="#4A5568" />
        <circle cx="200" cy="340" r="8" fill="#4A5568" />
        <circle cx="250" cy="340" r="8" fill="#4A5568" />
        <circle cx="150" cy="370" r="8" fill="#4A5568" />
        <circle cx="200" cy="370" r="8" fill="#4A5568" />
        <circle cx="250" cy="370" r="8" fill="#4A5568" />
        <circle cx="150" cy="400" r="8" fill="#4A5568" />
        <circle cx="200" cy="400" r="8" fill="#4A5568" />
        <circle cx="250" cy="400" r="8" fill="#4A5568" />
        
        {/* Fente de carte */}
        <rect x="120" y="450" width="160" height="15" rx="3" fill="#1A202C" />
        
        {/* Fente de billets */}
        <rect x="140" y="480" width="120" height="40" rx="5" fill="#1A202C" />
      </svg>
    </div>
  );
}
