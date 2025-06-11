import { SiteHeader } from "@/components/site-header"

export default function Features() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h1>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover the powerful features of Kinetic that make rehabilitation more effective.
              </p>
            </div>
            {/* Features content goes here */}
          </div>
        </div>
      </main>
    </div>
  )
}
