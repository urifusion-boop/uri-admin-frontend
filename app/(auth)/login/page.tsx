'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] p-4">
      <div className="w-full max-w-md rounded-[10px] border border-gray-100 shadow-sm md:p-8 p-6 bg-white flex-1 justify-self-center">
        <Link className="mx-auto max-w-fit block" href="/">
          <Image src="/assets/images/logo.png" alt="logo" width={70} height={40} />
        </Link>

        <h4 className="text-base font-normal mt-2 text-center text-[#141416]">
          Admin Portal - Sign in to access the admin dashboard
        </h4>

        <div className="md:mt-[50px] mt-[35px]">
          <form onSubmit={handleSubmit}>
            <div className="mt-3">
              <div className="mb-1">
                <Label htmlFor="email" className="text-[13px]">Email Address</Label>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E0DEF7] rounded-[10px] flex items-center h-[40px]">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@uricreative.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-transparent border-none outline-none w-full h-full text-[#141416] text-[14px] font-['Urbanist'] px-3"
                />
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1">
                <Label htmlFor="password" className="text-[13px]">Enter Password</Label>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E0DEF7] rounded-[10px] flex items-center h-[40px] relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-transparent border-none outline-none w-full h-full text-[#141416] text-[14px] font-['Urbanist'] px-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#9EA3AE] hover:text-[#141416] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-6 h-6" />
                  ) : (
                    <Eye className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-2">
              <Button
                type="submit"
                className="w-full bg-[#CD1B78] hover:bg-[#CD1B78]/90 text-white rounded-[8px] h-[48px] text-base border border-[#CD1B78]"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center space-y-2 mt-4">
          <p className="text-sm text-[#6C7272]">
            Admin access only
          </p>
          <p className="text-xs text-[#6C7272]">
            © {new Date().getFullYear()} URI Creative. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
