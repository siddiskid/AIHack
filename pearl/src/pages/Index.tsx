
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Add animation classes to elements when they enter the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            entry.target.style.opacity = "1";
          }
        });
      },
      { threshold: 0.1 }
    );

    // Target elements that should animate when in view
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      el.style.opacity = "0";
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div id="about" className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Prescripto
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Prescripto is an AI-powered tool designed specifically for healthcare professionals and patients. We're on a mission to make healthcare more accessible by streamlining documentation and improving communication between doctors and patients.
            </p>
            <p className="text-lg text-gray-600">
              Our platform leverages cutting-edge artificial intelligence to provide real-time transcription, translation, and summarization of medical consultations, enabling healthcare providers to focus more on patient care and less on paperwork.
            </p>
          </div>
        </div>
      </div>
      <div id="services" className="py-20 bg-indigo-50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-gray-600">
              Comprehensive solutions tailored for modern healthcare needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-on-scroll">
              <div className="w-14 h-14 mb-6 rounded-2xl gradient-indigo flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                AI Transcription
              </h3>
              <p className="text-gray-600">
                Our advanced speech recognition technology captures medical conversations with high accuracy, even with specialized terminology.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-on-scroll">
              <div className="w-14 h-14 mb-6 rounded-2xl gradient-indigo flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Translation Services
              </h3>
              <p className="text-gray-600">
                Break down language barriers in healthcare with our real-time translation capabilities across multiple languages.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-on-scroll">
              <div className="w-14 h-14 mb-6 rounded-2xl gradient-indigo flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Clinical Documentation
              </h3>
              <p className="text-gray-600">
                Generate comprehensive, structured medical notes and summaries that highlight key information from consultations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;

function Mic(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
  );
}

function Globe(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" x2="22" y1="12" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

function FileText(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" x2="8" y1="13" y2="13"></line>
      <line x1="16" x2="8" y1="17" y2="17"></line>
      <line x1="10" x2="8" y1="9" y2="9"></line>
    </svg>
  );
}

function MapPin(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function AlertCircle(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" x2="12" y1="8" y2="12"></line>
      <line x1="12" x2="12.01" y1="16" y2="16"></line>
    </svg>
  );
}
