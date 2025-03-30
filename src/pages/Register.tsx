
import Navbar from '@/components/Navbar';
import RegisterFormHeader from '@/components/auth/RegisterFormHeader';
import RegisterForm from '@/components/auth/RegisterForm';
import RegisterFooter from '@/components/auth/RegisterFooter';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <RegisterFormHeader />
            <RegisterForm />
            <RegisterFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
