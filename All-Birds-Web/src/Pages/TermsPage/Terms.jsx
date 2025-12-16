import React from 'react'
import { Link } from 'react-router-dom'

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md my-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="text-black">
          By accessing and using this website (the "Site"), you agree to be bound by these Terms and Conditions
          and all applicable laws and regulations. If you do not agree with any of these terms, please do not
          use the Site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Use of the Site</h2>
        <p className="text-black">
          You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of,
          restrict or inhibit anyone else's use and enjoyment of the Site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
        <p className="text-black">
          All content, trademarks, logos, and intellectual property displayed on the Site are owned by or
          licensed to Airbirds and are protected by copyright and other intellectual property laws.
          You may not reproduce, distribute, or use any content without prior written permission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. User Obligations</h2>
        <p className="text-black">
          You agree to provide accurate and truthful information when creating accounts or making purchases.
          You are responsible for maintaining the confidentiality of your account credentials.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. User Content</h2>
        <p className="text-black">
          If you submit or post any content to the Site, you grant Airbirds a non-exclusive, royalty-free, perpetual,
          and worldwide license to use, reproduce, modify, and distribute such content. You represent that you have
          all necessary rights to grant this license and that your content does not infringe on any third party rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Termination</h2>
        <p className="text-black">
          We reserve the right to suspend or terminate your access to the Site at any time, without prior notice,
          for conduct that we believe violates these Terms or is harmful to other users or the Site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Indemnification</h2>
        <p className="text-black">
          You agree to indemnify and hold harmless Airbirds and its affiliates from any claims, damages, liabilities,
          and expenses arising out of your use of the Site or violation of these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
        <p className="text-black">
          Airbirds shall not be liable for any damages arising from the use or inability to use the Site,
          including but not limited to direct, indirect, incidental, punitive, and consequential damages.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
        <p className="text-black">
          We may update these Terms from time to time. Continued use of the Site after changes implies your acceptance
          of the new Terms. We recommend reviewing this page periodically.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Refund Policy</h2>
        <p className="text-black">
          Refunds are processed in accordance with our <Link to='/privacy' className="text-blue-600 underline">Refund Policy</Link>.
          Please review it for detailed information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Third-Party Links</h2>
        <p className="text-black">
          The Site may contain links to third-party websites for your convenience. We do not endorse and are not responsible
          for the content or practices of these external sites.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">12. Governing Law</h2>
        <p className="text-black">
          These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].
          Any disputes arising shall be resolved in the courts located in [Your Jurisdiction].
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">13. Contact Us</h2>
        <p className="text-black">
          For any questions regarding these Terms, please contact us at <Link to='/helpcenter' className="text-blue-600 underline">support@airbirds.com</Link>.
        </p>
      </section>
    </div>
  )
}

export default Terms
