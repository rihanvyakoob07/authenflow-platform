
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col justify-center items-center p-4 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">Welcome to AuthenFlow</h1>
        <p className="text-xl mb-8">
          A modern, secure authentication system for your applications
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-indigo-600 hover:bg-gray-100"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
      

    </div>
  );
};

export default Index;
