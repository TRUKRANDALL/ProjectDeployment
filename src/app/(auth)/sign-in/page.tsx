"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Loader2 } from "lucide-react";
import GridBackground from '@/components/GridBackground';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
      } catch (error) { 
        if (error instanceof Error) {
          setError(`Failed to sign in. ${error.message}`);
        } else {
          setError('Failed to sign in.');
        }
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <GridBackground>
      <div className="flex justify-center items-center min-h-screen relative z-10">
        <div className="flex flex-col items-center justify-center h-screen">
          <form onSubmit={handleSignIn} className="w-[350px] md:w-[450px] drop-shadow-sm bg-white rounded-xl px-8 py-10 space-y-4">
            <div className="flex flex-col justify-center items-center mb-8">
              <Image
                src="/icon.png"
                alt="Lantaw Baka Logo"
                width={165}
                height={165}
              />
              <h1 className="text-2xl font-bold text-orange-500">Lantaw Baka</h1>
            </div>
            <div className="mb-8">
              <hr className="w-full mb-5" />
              <h1 className="text-2xl font-bold text-orange-500">Sign In</h1>
              <h6 className="text-sm text-gray-500">Welcome back to our platform</h6>
            </div>
            <div className="relative">
              <Input
                className="bg-gray-50 pl-10"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <Input  
                className="bg-gray-50 pl-10"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <h1 className="text-sm text-gray-500">Don&apos;t have an account? 
              <Link 
                className="text-orange-500 ml-1"
                href="/sign-up">
                  Sign Up
              </Link>
            </h1>
          </form>
        </div>
      </div>
    </GridBackground>
  )
}

export default SignInPage;
