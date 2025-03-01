
import { Button } from "@/components/ui/button";
import { BlurImage } from "@/components/ui/blur-image";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-white-indigo -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-indigo-50 to-transparent -z-10"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl -z-10"></div>
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left opacity-0 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
              AI-Powered Healthcare
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight md:leading-tight lg:leading-tight">
              Making healthcare{" "}
              <span className="gradient-text">accessible</span>,<br />
              one session at a time
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
              Live transcription and AI-powered summaries of doctor-patient conversations, 
              enhancing medical documentation and patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="gradient-indigo text-md px-8 py-6 rounded-full hover:shadow-lg transition-all">
                Get Started
              </Button>
              <Button variant="outline" className="text-md px-8 py-6 rounded-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-all">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="flex-1 opacity-0 animate-fade-in-up animation-delay-300">
            <div className="relative glass-card rounded-2xl overflow-hidden shadow-xl p-4 animate-float">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">P</div>
                      <div>
                        <h3 className="font-medium">Patient Consultation</h3>
                        <p className="text-xs text-gray-500">Live Transcribing...</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-gray-500">Recording</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-indigo-600">Doctor</span>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg rounded-tl-none">
                      Based on your symptoms, I'm recommending a course of antibiotics for 10 days. It's important to complete the full course.
                    </p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-indigo-600">Patient</span>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg rounded-tl-none">
                      Should I expect any side effects? And are there any specific foods I should avoid?
                    </p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-indigo-600">Doctor</span>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg rounded-tl-none">
                      You might experience mild nausea or headaches. Try taking it with food to reduce stomach discomfort. Avoid alcohol during treatment.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-50">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">AI Summary</h4>
                  <ul className="text-xs space-y-1.5 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="rounded-full w-5 h-5 bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                      <span>Prescribed 10-day course of antibiotics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="rounded-full w-5 h-5 bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                      <span>Take medication with food to reduce nausea</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="rounded-full w-5 h-5 bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                      <span>Avoid alcohol during treatment period</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
