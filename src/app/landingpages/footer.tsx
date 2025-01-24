import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo o Nombre */}
          <div className="text-2xl font-bold font-russo">Torogoz 3</div>

          {/* Enlaces de navegación */}
          <div className="flex justify-center space-x-6 mt-4 md:mt-2">
            <a href="/about" className="hover:underline">
              About Us
            </a>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
          </div>

          {/* Redes sociales */}
          <div className="flex space-x-4 mt-4 md:mt-2">
            <a
              href="https://twitter.com/torogoz3"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-white"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
            </a>
            <a
              href="https://github.com/Torogoz3/Torogoz3"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-white"
            >
              <FontAwesomeIcon icon={faGithub} className="text-2xl" />
            </a>
          </div>

          {/* Créditos */}
          <div className="text-sm mt-4 md:mt-2">
            © {new Date().getFullYear()} IDΞN3 LLC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
