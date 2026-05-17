import HeroSection from "@/components/hero";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 1st module dashboard
export default function Home() {
  return (
    <div className="mt-40">
      
    {/* Hero section */}
      <HeroSection />
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {statsData.value}
                </div>
                <div className="text-gray-600">{statsData.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* feature section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Track, Save and Grow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100"
              >
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* how its works section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-7">
                  {step.icon}
                </div>
                <h3 className="text-xl mb-3.5 font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    {/* Testimonial section */}
      <section className="py-20">

        <div className="container mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-12">

            Real Stories-Real Results

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {testimonialsData.map((testimonial, index) => (

              <Card key={index} className="p-6">

                <CardContent className="pt-4">

                  <div className="flex items-center mb-4">

                    <Image

                      src={testimonial.image}

                      alt={testimonial.name}

                      width={40}

                      height={40}

                      className="rounded-full w-10 h-10"

                    />

                    <div className="ml-4">

                      <div className="font-semibold">{testimonial.name}</div>

                      <div className="text-sm text-gray-600">

                        {testimonial.role}

                      </div>

                    </div>

                  </div>

                  <p className="text-gray-600 text-sm italic leading-relaxed">

                    {testimonial.quote}

                  </p>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

      </section>

 

      {/* last cell */}

      <section className="py-20 bg-slate-900 text-white">

        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-center mb-4">

            Ready to Take Control Your Finances?

          </h2>

          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">

            Transform the way you manage your money, gain clarity in every

            decision and move closer to your dreams with confidence.

          </p>

          <Link href="/dashboard">

            <Button

              size="lg"

              className="bg-white text-blue-700 font-semibold

               px-6 py-2.5 rounded-xl

               shadow-md shadow-blue-500/10

               transition-all duration-300 ease-out

               hover:-translate-y-1

               hover:bg-blue-600

               hover:text-white

               hover:shadow-xl hover:shadow-blue-500/30

 

               active:translate-y-0 active:shadow-md

               animate-[bounce_2s_infinite]"

            >

              Start Free Trial

            </Button>

          </Link>

        </div>

      </section> 
      
    </div>
  );
}
