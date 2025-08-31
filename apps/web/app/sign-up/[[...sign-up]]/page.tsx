import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Join BambooInnovasia
          </h1>
          <p className="text-green-700">
            Start your sustainable networking journey today
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border border-green-200"
            }
          }}
          routing="path"
          path="/sign-up"
          redirectUrl="/onboarding"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}