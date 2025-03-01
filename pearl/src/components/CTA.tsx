
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-indigo opacity-95 -z-10"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-400 rounded-full opacity-30 blur-3xl -z-10"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400 rounded-full opacity-30 blur-3xl -z-10"></div>
      
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 opacity-0 animate-fade-in-up">
            Ready to transform your healthcare experience?
          </h2>
          <p className="text-lg mb-8 text-indigo-100 opacity-0 animate-fade-in-up animation-delay-300">
            Join thousands of healthcare providers already using Prescripto to improve patient care, reduce documentation time, and enhance communication.
          </p>
          <Button className="bg-white text-indigo-700 hover:bg-indigo-50 text-md px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all opacity-0 animate-fade-in-up animation-delay-600">
            Get Started for Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
