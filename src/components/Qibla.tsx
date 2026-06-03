import { useSeoHead } from '../hooks/useSeoHead';
import { useQibla } from '../hooks/useQibla';
import { Compass, AlertTriangle, Navigation2 } from 'lucide-react';

export function Qibla() {
  useSeoHead({
    title: 'Qibla Compass | DeenHQ',
    description: 'Find the exact direction of the Qibla (Mecca) directly from your device, 100% offline.',
  });

  const { 
    qiblaBearing, 
    deviceHeading, 
    isSupported, 
    permissionGranted, 
    requestPermission,
    pointingToQibla
  } = useQibla();

  const compassRotation = deviceHeading !== null ? -deviceHeading : 0;
  
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-3xl mx-auto space-y-12 min-h-[80vh] flex flex-col items-center justify-center">
      <header className="text-center space-y-4 w-full">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Qibla Compass
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Align your heart and body towards the Kaaba.
        </p>
      </header>

      {!isSupported && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 w-full">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>Your device does not support compass/orientation sensors.</p>
        </div>
      )}

      {isSupported && permissionGranted === false && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 w-full">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>Compass permission was denied. Please reset your browser permissions and try again.</p>
        </div>
      )}

      {isSupported && permissionGranted === null && (
        <button 
          onClick={requestPermission}
          className="bg-primary hover:bg-teal-600 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg shadow-teal-500/30 flex items-center gap-2 mt-8"
        >
          <Compass className="w-5 h-5" />
          Enable Compass
        </button>
      )}

      <div className={`relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center my-12 transition-opacity duration-500 ${permissionGranted === null ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center bg-white dark:bg-slate-900">
           <span className="absolute top-4 text-slate-400 font-bold">N</span>
           <span className="absolute right-4 text-slate-400 font-bold">E</span>
           <span className="absolute bottom-4 text-slate-400 font-bold">S</span>
           <span className="absolute left-4 text-slate-400 font-bold">W</span>
        </div>

        {/* Dynamic Compass Dial */}
        <div 
          className="absolute inset-0 rounded-full transition-transform duration-300 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${compassRotation}deg)` }}
        >
           {/* Qibla Indicator */}
           <div 
             className="absolute w-full h-full"
             style={{ transform: `rotate(${qiblaBearing}deg)` }}
           >
             <div className="w-6 h-6 bg-emerald-500 rounded-full mx-auto -mt-3 shadow-lg shadow-emerald-500/50 border-4 border-white dark:border-slate-900 relative z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
             </div>
             <div className="w-0.5 h-1/2 bg-gradient-to-b from-emerald-500 to-transparent mx-auto opacity-50" />
           </div>
        </div>

        {/* Phone Direction Indicator */}
        <div className="absolute z-20 bg-white dark:bg-slate-900 rounded-full p-2 shadow-sm">
          <Navigation2 
            className={`w-12 h-12 transition-colors duration-300 ${pointingToQibla ? 'text-emerald-500' : 'text-primary'}`} 
            strokeWidth={2}
            fill="currentColor"
          />
        </div>
      </div>

      <div className="text-center space-y-6 mt-8">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Current Heading
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {deviceHeading !== null ? Math.round(deviceHeading) : '--'}°
            </p>
          </div>
          <div className="w-px h-12 bg-slate-200 dark:bg-slate-800"></div>
          <div className="text-center">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Qibla Bearing
            </p>
            <p className="text-3xl font-bold text-emerald-500 tabular-nums">
              {Math.round(qiblaBearing)}°
            </p>
          </div>
        </div>
        <div className="h-8 mt-4">
          {pointingToQibla && (
            <p className="text-emerald-500 font-medium animate-pulse">
              You are facing the Qibla!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
