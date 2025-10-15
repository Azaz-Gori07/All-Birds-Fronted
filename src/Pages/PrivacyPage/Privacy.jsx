import React from 'react';

const Privacy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p className="text-black">
        Allbirds, Inc. (together with its affiliates, “Allbirds”) endeavors to protect your personal information. This Privacy Policy informs you about our practices regarding the treatment of information we collect from you online and offline, the kinds of information we may collect, how that information is used, with whom we share it, and how you can opt-out of a use or correct or change such information.
      </p>

      <p className="text-black">
        This Privacy Policy is incorporated into Allbirds Terms of Use by reference, as if set forth fully therein, which must be reviewed and accepted by you.
      </p>

      <p className="text-black">
        If you have any questions about our privacy policies, please contact us at <a href="mailto:privacy@allbirds.com" className="text-blue-600">privacy@allbirds.com</a> or call us at +1-888-963-8944. By providing your personal information to Allbirds, you signify your acceptance of the Terms of Use and agree that Allbirds may collect, use, and disclose your personal information as described herein.
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-4">1. Scope</h2>
        <p className="text-black">
          This Privacy Policy applies to personal information that is processed by Allbirds in the course of our business, including via Allbirds' web properties (e.g., Allbirds.com), mobile apps, forums, social media accounts, blogs, retail stores, and other online or offline offerings.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">2. Information We Collect</h2>

        <h3 className="font-semibold">A. Personally Identifiable Information</h3>
        <p className="text-black">
          The types of personally identifiable information we collect and our privacy practices depend on the nature of your relationship with Allbirds and applicable laws.
        </p>

        <h3 className="font-semibold mt-5">B. Types of personal information</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Information Provided Directly:</strong> Includes name, email, phone, address, and payment info.
          </li>
          <li>
            <strong>Communications:</strong> Info collected when contacting customer support or participating in promotions.
          </li>
          <li>
            <strong>Surveys and Reviews:</strong> Voluntary information for improving products/services.
          </li>
          <li>
            <strong>Sweepstakes:</strong> Contact information and opt-out options for promotional content.
          </li>
          <li>
            <strong>Public Posts:</strong> Content posted in public areas is not covered under this privacy policy.
          </li>
          <li>
            <strong>Third Parties:</strong> Supplemental info from other sources (e.g., Experian).
          </li>
          <li>
            <strong>Automated Data:</strong> Includes IP, cookies, device ID, geolocation, browser type, and interaction history.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide products, services, or requested information</li>
          <li>For administrative purposes</li>
          <li>For marketing and promotional activities</li>
          <li>For research and development</li>
          <li>To send direct mail, emails, or telemarketing messages</li>
          <li>To generate anonymized or aggregated reports</li>
          <li>To share content via referrals or invitations</li>
          <li>For legal compliance or fraud protection</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">4. Cookies, Pixels, and Similar Technologies</h2>
        <p className="text-black">
          We and third parties may use cookies and similar technologies to collect data for operational, performance-related, functionality-related, and advertising purposes.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Operational (e.g., shopping carts, login)</li>
          <li>Performance-related (analytics, site usage)</li>
          <li>Functionality-related (preferences, personalization)</li>
          <li>Advertising-related (ads tailored to your interests)</li>
        </ul>
      </section>
    </div>
  );
};

export default Privacy;