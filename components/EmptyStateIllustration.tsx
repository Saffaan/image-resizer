export const EmptyStateIllustration = () => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center pointer-events-none select-none overflow-hidden">
        {/* Workflow Animation Styles */}
        <style>{`
            /* Main container scaling to simulate Zoom In (Edit) -> Zoom Out (Compress) */
            @keyframes stage-transform {
                0%, 30% { transform: scale(1); }
                35% { transform: scale(0.4); }
                90% { transform: scale(0.4); }
                95%, 100% { transform: scale(1); }
            }

            /* Cross-fade between Editor View and File Icon View */
            @keyframes view-swap-1 {
                0%, 32% { opacity: 1; }
                33%, 100% { opacity: 0; }
            }
            @keyframes view-swap-2 {
                0%, 32% { opacity: 0; }
                33%, 92% { opacity: 1; }
                95%, 100% { opacity: 0; }
            }

            /* Editor Animations (Resize/Crop) */
            @keyframes editor-resize {
                0%, 100% { width: 300px; x: 150; height: 220px; y: 90; }
                15% { width: 360px; x: 120; height: 260px; y: 70; } /* Expand */
                25% { width: 280px; x: 160; height: 220px; y: 90; } /* Contract */
            }
            @keyframes handle-pulse {
                0%, 100% { r: 6; stroke-width: 2; }
                50% { r: 8; stroke-width: 3; }
            }
            @keyframes scan-line-move {
                0% { transform: translateY(-100%); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(100%); opacity: 0; }
            }

            /* File & Conversion Animations */
            @keyframes format-cycle-jpg { 
                0%, 34% { opacity: 0; transform: translateY(10px); } 
                35%, 48% { opacity: 1; transform: translateY(0); } 
                49%, 100% { opacity: 0; transform: translateY(-10px); } 
            }
            @keyframes format-cycle-png { 
                0%, 49% { opacity: 0; transform: translateY(10px); } 
                50%, 63% { opacity: 1; transform: translateY(0); } 
                64%, 100% { opacity: 0; transform: translateY(-10px); } 
            }
            @keyframes format-cycle-webp { 
                0%, 64% { opacity: 0; transform: translateY(10px); } 
                65%, 88% { opacity: 1; transform: translateY(0); } 
                89%, 100% { opacity: 0; transform: translateY(-10px); } 
            }
            @keyframes compress-badge-pop {
                0%, 35% { transform: scale(0); opacity: 0; }
                38%, 88% { transform: scale(1); opacity: 1; }
                90%, 100% { transform: scale(0); opacity: 0; }
            }

            /* Apply classes */
            .animate-stage { animation: stage-transform 10s ease-in-out infinite; transform-origin: center; }
            .view-editor { animation: view-swap-1 10s linear infinite; }
            .view-file { animation: view-swap-2 10s linear infinite; }
            .anim-resize-rect { animation: editor-resize 10s ease-in-out infinite; }
            .anim-handle { animation: handle-pulse 2s ease-in-out infinite; }
            .anim-scan { animation: scan-line-move 3s linear infinite; }
            
            .text-jpg { animation: format-cycle-jpg 10s ease-in-out infinite; }
            .text-png { animation: format-cycle-png 10s ease-in-out infinite; }
            .text-webp { animation: format-cycle-webp 10s ease-in-out infinite; }
            .badge-pop { animation: compress-badge-pop 10s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite; transform-origin: 380px 120px; }
            
            .float-bg { animation: float-bg 8s ease-in-out infinite; }
            @keyframes float-bg { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        `}</style>
        
        <svg viewBox="0 0 600 400" className="w-full max-w-3xl h-auto drop-shadow-2xl float-bg">
            <defs>
                <linearGradient id="grad-blue" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="grad-badge" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <clipPath id="screen-clip">
                    <rect x="120" y="70" width="360" height="260" rx="12" />
                </clipPath>
            </defs>
            
            {/* Background Elements */}
            <circle cx="300" cy="200" r="180" fill="url(#grad-blue)" opacity="0.03" />
            <circle cx="300" cy="200" r="120" fill="url(#grad-blue)" opacity="0.05" />

            {/* MAIN TRANSFORM GROUP (Scales down and up) */}
            <g className="animate-stage">
                
                {/* --- VIEW 1: EDITOR (Resizing) --- */}
                <g className="view-editor">
                    {/* Image Frame/Window */}
                    <rect x="100" y="50" width="400" height="300" rx="20" fill="white" stroke="#E5E7EB" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-700 shadow-xl" />
                    
                    {/* Header Bar */}
                    <path d="M100 70 C100 58.954 108.954 50 120 50 H480 C491.046 50 500 58.954 500 70 V80 H100 V70 Z" fill="#F3F4F6" className="dark:fill-gray-700" />
                    <circle cx="125" cy="65" r="4" fill="#EF4444" />
                    <circle cx="140" cy="65" r="4" fill="#F59E0B" />
                    <circle cx="155" cy="65" r="4" fill="#10B981" />

                    {/* Resizing Image Area */}
                    <g>
                        {/* Dynamic Rect simulating image */}
                        <rect className="anim-resize-rect" fill="url(#grad-blue)" opacity="0.1" stroke="#3B82F6" strokeWidth="2" strokeDasharray="8 4" rx="8" />
                        
                        {/* Image Content (Centered relative to resize-rect logic roughly) */}
                        <g transform="translate(300, 200)">
                            <circle r="30" fill="white" fillOpacity="0.5" />
                            <path d="M-20 10 L0 -15 L20 10 Z" fill="white" fillOpacity="0.8" />
                        </g>

                        {/* Corner Handles (Static positions relative to animation not possible easily with CSS w/o JS logic for exact coords, using simplified centered approach or fixed large handles) */}
                        {/* We use a fixed overlay for handles to imply UI controls */}
                        <g opacity="0.5">
                            <circle cx="150" cy="90" r="6" fill="#3B82F6" className="anim-handle" />
                            <circle cx="450" cy="90" r="6" fill="#3B82F6" className="anim-handle" style={{animationDelay: '0.5s'}}/>
                            <circle cx="450" cy="310" r="6" fill="#3B82F6" className="anim-handle" style={{animationDelay: '1s'}}/>
                            <circle cx="150" cy="310" r="6" fill="#3B82F6" className="anim-handle" style={{animationDelay: '1.5s'}}/>
                        </g>
                    </g>

                    {/* Scanning Beam */}
                    <g clipPath="url(#screen-clip)">
                        <rect x="100" y="50" width="400" height="2" fill="#3B82F6" className="anim-scan" />
                    </g>
                </g>


                {/* --- VIEW 2: COMPRESSED FILE (Conversion) --- */}
                <g className="view-file">
                    {/* File Shape */}
                    <path d="M220 50 H320 L380 110 V350 H220 V50 Z" fill="white" className="dark:fill-gray-800" stroke="url(#grad-blue)" strokeWidth="4" filter="url(#glow)" />
                    <path d="M320 50 V110 H380" fill="#E5E7EB" className="dark:fill-gray-700" opacity="0.5" />

                    {/* Format Text Cycle */}
                    <g transform="translate(300, 240)" textAnchor="middle">
                         <text x="0" y="0" fontSize="48" fontWeight="bold" fill="#3B82F6" className="text-jpg dark:fill-blue-400">JPG</text>
                         <text x="0" y="0" fontSize="48" fontWeight="bold" fill="#8B5CF6" className="text-png dark:fill-purple-400">PNG</text>
                         <text x="0" y="0" fontSize="42" fontWeight="bold" fill="#EC4899" className="text-webp dark:fill-pink-400">WEBP</text>
                    </g>
                    
                    {/* File Icon Graphic */}
                    <rect x="260" y="140" width="80" height="60" rx="4" fill="#F3F4F6" className="dark:fill-gray-700" />
                    <circle cx="300" cy="170" r="15" fill="#3B82F6" opacity="0.2" />

                    {/* Success Badge (KB) */}
                    <g className="badge-pop">
                        <circle cx="380" cy="120" r="35" fill="url(#grad-badge)" stroke="white" strokeWidth="4" className="dark:stroke-gray-900" />
                        <text x="380" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">-70%</text>
                        <text x="380" y="140" textAnchor="middle" fill="white" fontSize="10" opacity="0.9">SIZE</text>
                    </g>
                </g>
            </g>
        </svg>
    </div>
  );
};