const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-4xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Terms of Service</h1>

        <p className="mb-4 text-gray-700">Last updated: June 2025</p>

        <p className="mb-4">
          Welcome to Read Racer. By accessing or using our website, mobile application, and related services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
        </p>

        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>
            <strong>Use of Services:</strong> You agree to use the Services only for lawful purposes and in accordance with these Terms. You must not use the Services in any way that could damage, disable, overburden, or impair the Services or interfere with any other party’s use.
          </li>
          <li>
            <strong>User Accounts:</strong> To participate in the experiment or access certain features, you may be required to create a user account. You agree to provide accurate and complete information, and to keep your account credentials secure. You are responsible for all activity under your account.
          </li>
          <li>
            <strong>Experiment Participation:</strong> The Services include experimental reading and comprehension tests. Participation is voluntary and for research purposes only. You acknowledge that your data will be collected and used in accordance with our Privacy Policy.
          </li>
          <li>
            <strong>Intellectual Property:</strong> All content, trademarks, and data on the Services are owned by or licensed to Read Racer. You agree not to copy, reproduce, or distribute any content without permission.
          </li>
          <li>
            <strong>Data Collection and Use:</strong> We collect certain data from your participation to improve the Services and conduct research. Please review our Privacy Policy for details on data usage.
          </li>
          <li>
            <strong>Disclaimers and Limitation of Liability:</strong> The Services are provided "as is" without warranties of any kind. We do not guarantee accuracy, reliability, or results from the use of the Services. To the fullest extent permitted by law, Read Racer shall not be liable for any damages arising from use or inability to use the Services.
          </li>
          <li>
            <strong>Termination:</strong> We may suspend or terminate your access to the Services at any time without notice for violations of these Terms.
          </li>
          <li>
            <strong>Changes to Terms:</strong> We may update these Terms from time to time. Your continued use of the Services after changes indicates your acceptance of the new Terms.
          </li>
          <li>
            <strong>Governing Law:</strong> These Terms are governed by the laws of the United States and applicable local laws.
          </li>
          <li>
            <strong>Contact Us:</strong> If you have questions about these Terms, please contact us at <a href="mailto:ReadRacerHelp@gmail.com" className="text-blue-600 underline">readracerhelp@gmail.com</a>.
          </li>
        </ol>

        <p className="mt-6 text-gray-700 font-semibold">
          By using Read Racer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
