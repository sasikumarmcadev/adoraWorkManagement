import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DottedSurface } from '../components/ui/dotted-surface';
import LightRays from '../components/ui/light-rays';
import { cn } from '../lib/utils';
import { User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const result = login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-hidden font-sans flex flex-col items-center justify-center">
      {/* 1. OGL LightRays Background Layer */}
      <div className="absolute inset-0 z-0">
        <DottedSurface className="opacity-10" />
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.4}
          lightSpread={1.2}
          rayLength={2.5}
          pulsating={true}
          fadeDistance={1.0}
          saturation={0.2}
          noiseAmount={0.3}
          distortion={0.05}
          className="opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* 2. Main Professional Layout */}
      <main className="relative z-10 w-full max-w-6xl px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">

        {/* Left Side: Precision Alignment Branding */}
        <div className="hidden lg:flex flex-col space-y-12 animate-fade-in pr-6">
          <div className="space-y-10">
            <div className="inline-block transition-transform duration-500 hover:translate-x-1">
              <img
                src="https://res.cloudinary.com/dhw6yweku/image/upload/v1756276288/l3kbqtpkrsz2lqshmmmj.png"
                alt="Logo"
                className="h-16 w-auto brightness-110 mb-2"
              />
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mt-4" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-medium  tracking-[-0.05em] leading-[0.9] text-white">
                Work <br />
                <span className="text-white/20">Management.</span>
              </h1>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium  tracking-widest text-white/40 leading-relaxed max-w-xs">
                A high-performance workspace for agency workflow optimization.
              </p>
              <div className="h-0.5 w-8 bg-white/10" />
            </div>
          </div>
        </div>

        {/* Right Side: High-End Minimal Login Form */}
        <div className="w-full max-w-md mx-auto lg:ml-0 animate-fade-up px-4 sm:px-0" style={{ animationDelay: '0.2s' }}>
          <div className="relative bg-white/[0.02] border border-white/[0.08] p-8 sm:p-14 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] group">

            {/* Logo for mobile view */}
            <div className="lg:hidden flex flex-col items-center mb-12 text-center">
              <img
                src="https://res.cloudinary.com/dhw6yweku/image/upload/v1756276288/l3kbqtpkrsz2lqshmmmj.png"
                alt="Logo"
                className="h-12 w-auto mb-6"
              />
              <h2 className="text-2xl font-medium  tracking-tighter">Work Management</h2>
            </div>

            <div className="mb-8 text-center lg:text-left">

              <h3 className="text-3xl sm:text-4xl font-medium tracking-tighter leading-none lg:tracking-[0.1em]">Sign In</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px]  font-medium tracking-[0.2em] text-white/40 ml-1">UserID</label>
                <div className="relative group/input">
                  <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-white transition-colors" />
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    className="w-full bg-white/[0.01] border border-white/10 rounded-full pl-16 pr-6 py-5 text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.03] transition-all placeholder:text-white/5 text-white"
                    placeholder="Agency ID"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px]  font-medium tracking-[0.2em] text-white/40">Password</label>
                </div>
                <div className="relative group/input">
                  <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-white transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white/[0.01] border border-white/10 rounded-full pl-16 pr-14 py-5 text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.03] transition-all placeholder:text-white/5 text-white"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-medium  tracking-widest py-4 px-4 rounded-full text-center animate-shake">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className={cn(
                  "group w-52 mx-auto flex items-center gap-4 p-1.5 pr-4 rounded-full border border-white/10 bg-black/40  transition-all duration-500",
                  "disabled:opacity-50 shadow-2xl"
                )}
              >
                <div className="flex-shrink-0 bg-white rounded-full p-3.5 text-black transition-all duration-500 ">
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={18} className="transition-transform duration-500" />
                  )}
                </div>
                <div className="flex flex-col items-start translate-x-1">
                   <span className="text-white font-medium text-sm tracking-[0.1em] ">Sign In</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-fade-up { animation: fade-up 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />
    </div>
  );
};

export default Login;

