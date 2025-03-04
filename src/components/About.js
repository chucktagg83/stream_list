import React from "react";
import { motion } from "framer-motion";
import { FaFilm, FaTv, FaStar, FaUsers, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const AboutUs = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="about-container p-6 bg-gray-50 text-gray-900 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-700">Welcome to StreamList</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your ultimate destination for personalized streaming entertainment
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.section variants={itemVariants} className="mb-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center">
            <FaFilm className="mr-2" /> Our Story
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            StreamList was founded in 2023 with a simple vision: to create a platform that truly understands how modern viewers consume content. We noticed that people were spending more time deciding what to watch than actually watching. That's why we built StreamList — to help you organize, discover, and enjoy the content you love without the hassle.
          </p>
        </motion.section>

        {/* Features */}
        <motion.section variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600 flex items-center">
            <FaStar className="mr-2" /> What Makes Us Different
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-indigo-500">Personalized Watchlists</h3>
              <p className="text-gray-700">Create custom collections of movies and shows you want to watch, organized your way.</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-indigo-500">Flexible Content Access</h3>
              <p className="text-gray-700">Choose how you want to enjoy content — buy, rent, or subscribe for unlimited access.</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-indigo-500">Smart Recommendations</h3>
              <p className="text-gray-700">Our algorithm learns your preferences to suggest content you'll actually enjoy.</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-indigo-500">Cross-Platform Sync</h3>
              <p className="text-gray-700">Start watching on one device and seamlessly continue on another.</p>
            </div>
          </div>
        </motion.section>

        {/* Our Mission */}
        <motion.section variants={itemVariants} className="mb-12 bg-indigo-600 text-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaUsers className="mr-2" /> Our Mission
          </h2>
          <p className="text-lg leading-relaxed">
            We believe that entertainment should be accessible, organized, and tailored to your preferences. Our mission is to revolutionize how you discover and enjoy digital content by providing a platform that respects your time and understands your taste.
          </p>
          <div className="mt-6 text-center">
            <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
              Join Our Community
            </button>
          </div>
        </motion.section>

        {/* Team */}
        <motion.section variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600 flex items-center">
            <FaUsers className="mr-2" /> Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Alex Johnson</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Sarah Chen</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Miguel Rodriguez</h3>
              <p className="text-gray-600">Head of Content</p>
            </div>
          </div>
        </motion.section>

        {/* Contact & Location */}
        <motion.section variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Find Us
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white p-5 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-3 text-indigo-500">Contact Information</h3>
                <p className="flex items-center mb-2">
                  <FaEnvelope className="mr-2 text-indigo-500" /> support@streamlist.com
                </p>
                <p className="flex items-center mb-2">
                  <FaPhone className="mr-2 text-indigo-500" /> (555) 123-4567
                </p>
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-indigo-500" /> 1234 Movie Lane, Streaming City, ST 56789
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-indigo-500">Business Hours</h3>
                <p className="mb-1"><strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM</p>
                <p><strong>Weekend:</strong> 10:00 AM - 4:00 PM</p>
              </div>
            </div>
            
            <div className="h-full">
              {/* Google Map */}
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"}>
                <GoogleMap 
                  mapContainerStyle={containerStyle} 
                  center={center} 
                  zoom={12}
                  options={{
                    styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
                  }}
                >
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section variants={itemVariants} className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Streaming Experience?</h2>
          <p className="text-lg mb-6">Join thousands of satisfied users who have made StreamList their go-to entertainment platform.</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
              Sign Up Now
            </button>
            <button className="border-2 border-white text-white font-bold py-2 px-6 rounded-full hover:bg-white hover:text-indigo-600 transition-colors">
              Learn More
            </button>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AboutUs;
