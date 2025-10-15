import { Link } from "react-router-dom";
import ApprochSection from "../../Components/ApproachCard/ApprochSection";

const Accessibility = () => {
  return (
    <div className="bg-white min-h-screen px-4 md:px-24 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          Our Commitment to Accessibility
        </h1>

        <p className="text-gray-800 text-base leading-relaxed mb-6">
          Allbirds, Inc. is committed to making our website's content accessible and user friendly to everyone.
        </p>

        <p className="text-gray-800 text-base leading-relaxed mb-6">
          If you are having difficulty viewing or navigating the content on this website, or notice any content, 
          feature, or functionality that you believe is not fully accessible to people with disabilities, 
          please call our Customer Service team at 
          <span className="font-semibold text-black"> 1-888-963-8944 </span> 
          or email our team at{" "}
          <Link 
            to='/helpcenter'
            className="font-semibold text-black underline hover:text-blue-500 transition"
          >
            help@allbirds.com
          </Link>{" "}
          with “Disabled Access” in the subject line and provide a description of the specific feature 
          you feel is not fully accessible or a suggestion for improvement.
        </p>

        <p className="text-gray-800 text-base leading-relaxed mb-6">
          We take your feedback seriously and will consider it as we evaluate ways to accommodate all of our 
          customers and our overall accessibility policies.
        </p>

        <p className="text-gray-800 text-base leading-relaxed mb-40">
          Additionally, while we do not control such vendors, we strongly encourage vendors of third-party 
          digital content to provide content that is accessible and user friendly.
        </p>
      </div>
      

      <ApprochSection/>
    </div>
    
  );
};

export default Accessibility;
