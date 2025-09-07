// components/Loading.tsx
import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    // -------------------------
    // Container for Loader
    // -------------------------
    <div className="flex flex-col items-center justify-center h-[80vh] ">
      
      {/* Spinner Icon from lucide-react */}
      <Loader2 className="animate-spin w-16 h-16 text-amber-600" />

      {/* Optional text displayed below the spinner */}
      <p className="mt-4 text-gray-700 text-lg">Loading...</p>
    </div>
  );
};

export default Loading;
