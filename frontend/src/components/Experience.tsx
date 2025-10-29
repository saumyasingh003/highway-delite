import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFilteredExperiences } from "../hooks/useFilteredExperiences";
import { useAuth } from "../context/AuthContext";

type Experience = {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  slots: Array<{
    date: string;
    time: string;
    available: boolean;
  }>;
};

const Experiences: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  
  const filteredExperiences = useFilteredExperiences(experiences);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/experiences");
        setExperiences(res.data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading experiences...
      </p>
    );
  }

  return (
    <div className="px-6 md:px-16 py-10">
    

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredExperiences.map((exp) => (
          <div
            key={exp._id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 c"
          >
            <img
              src={exp.image}
              alt={exp.title}
              className="h-48 w-full object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-lg">{exp.title}</h3>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-md text-gray-700 mt-1 inline-block">
              {exp.location}
            </span>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {exp.description}
            </p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-800 font-semibold">
                From <span className="text-lg">₹{exp.price}</span>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!auth.user) {
                    navigate('/login', { state: { from: { pathname: `/experiences/${exp._id}` } } });
                  } else {
                    navigate(`/experiences/${exp._id}`);
                  }
                }}
                className="bg-[#FED643] hover:bg-yellow-500 cursor-pointer text-black font-medium px-4 py-1.5 rounded-md text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
