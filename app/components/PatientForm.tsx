'use client';

interface PatientFormData {
  age: number;
  gender: string;
  prakriti: string;
}

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
}

export default function PatientForm({ onSubmit }: PatientFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: PatientFormData = {
      age: Number(formData.get('age')),
      gender: formData.get('gender') as string,
      prakriti: formData.get('prakriti') as string,
    };
    
    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Patient Information
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            required
            min="1"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter age"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="prakriti" className="block text-sm font-medium text-gray-700 mb-2">
            Ayurvedic Prakriti
          </label>
          <select
            id="prakriti"
            name="prakriti"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Prakriti</option>
            <option value="Vata">Vata</option>
            <option value="Pitta">Pitta</option>
            <option value="Kapha">Kapha</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium"
        >
          Generate Diet Plan
        </button>
      </form>
    </div>
  );
}