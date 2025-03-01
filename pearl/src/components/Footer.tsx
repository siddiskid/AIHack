
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container px-4 mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl font-bold gradient-text">Prescripto</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              Making healthcare accessible, one session at a time. Transforming doctor-patient communication through AI-powered transcription and summaries.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Support</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Docs</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Email</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Twitter</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Prescripto. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
