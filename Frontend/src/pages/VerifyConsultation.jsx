import React, { useEffect , useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyConsultation = () => {
  const { token } = useParams();
  const api = 'http://localhost:3000';
  const [success,setSuccess] = useState(false);
  const [isError,setError] = useState(false);

  useEffect(() => {
    const verifyBooking = async () => {
      try {
        const response = await axios.get(`${api}/verify-consultation/${token}`);
        alert('Consultation verified successfully!');
        // optionally redirect or show a success page
      } catch (err) {
        // alert('Verification failed or link expired.');
      }
    };

    verifyBooking();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Verifying your appointment...</h2>
      {/* Add loading spinner if you like */}
    </div>
  );
};

export default VerifyConsultation;
