'use client';

export default function TestRadio() {
  return (
    <div className="m-20 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Minimal Test Case</h1>
      <label className="p-4 border-2 border-dashed border-gray-400 block cursor-pointer">
        <input type="radio" name="test-radio" className="sr-only peer" />
        
        <p className="font-bold text-lg">Click anywhere in this box.</p>
        
        <div className="mt-4 w-full h-16 bg-red-500 flex items-center justify-center text-white font-bold text-xl
                        peer-checked:bg-green-500">
          This box MUST turn green when selected.
        </div>
      </label>
    </div>
  );
}