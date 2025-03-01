
import { Mic, Globe, FileText, MapPin, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Mic className="h-6 w-6" />,
    name: "Real-time Speech-to-text",
    description:
      "Capture every detail of doctor-patient conversations with our advanced real-time transcription technology.",
    delay: "0",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    name: "Real-time Translation",
    description:
      "Break language barriers in healthcare with instant translation across multiple languages.",
    delay: "300",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    name: "AI-generated Summaries",
    description:
      "Get concise, actionable summaries highlighting key diagnoses, prescriptions, and follow-up steps.",
    delay: "600",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    name: "Nearest Pharmacy Finder",
    description:
      "Quickly locate the nearest pharmacies to fill prescriptions with integrated maps and directions.",
    delay: "900",
  },
  {
    icon: <AlertCircle className="h-6 w-6" />,
    name: "Prescription Analysis",
    description:
      "Upload photos of prescriptions for digital analysis, verification, and storage in your profile.",
    delay: "300",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    name: "Customized Reports",
    description:
      "Different summary formats tailored specifically for healthcare providers and patients.",
    delay: "600",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50/80 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-indigo-50/80 to-transparent"></div>
      
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful features for better healthcare
          </h2>
          <p className="text-gray-600">
            Our AI-powered platform offers a comprehensive suite of tools designed to enhance medical documentation and patient care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "relative p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in-up",
                `animation-delay-${feature.delay}`
              )}
            >
              <div className="absolute -top-4 left-8 w-8 h-8 flex items-center justify-center rounded-full gradient-indigo shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">
                {feature.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
