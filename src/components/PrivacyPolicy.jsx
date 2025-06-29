const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-4xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Privacy Policy</h1>

        <p className="mb-4 text-gray-700">Last updated: June 2025</p>

        <p className="mb-4">
          Read Racer is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website, mobile app, and related services ("Services").
        </p>

        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>
            <strong>Information We Collect:</strong>
            <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
              <li><em>Personal Information:</em> We may collect personal information you provide when you register, such as your name, email address, and profile details.</li>
              <li><em>Usage Data:</em> We collect data about your interactions with the Services, including reading times, quiz answers, device information, IP address, and browser type.</li>
              <li><em>Cookies and Tracking:</em> We use cookies and similar technologies to enhance your experience and collect analytics.</li>
            </ul>
          </li>

          <li>
            <strong>How We Use Your Information:</strong>
            <p>To provide and maintain the Services, analyze usage, conduct research, communicate with you, and comply with legal obligations.</p>
          </li>

          <li>
            <strong>Data Sharing and Disclosure:</strong>
            <p>We do not sell your personal information. We may share data with trusted third-party service providers who assist in operating the Services, under confidentiality agreements.</p>
          </li>

          <li>
            <strong>Data Security:</strong>
            <p>We implement reasonable security measures to protect your information from unauthorized access, alteration, or disclosure.</p>
          </li>

          <li>
            <strong>Your Choices:</strong>
            <p>You may access, update, or delete your personal information by contacting us. You may opt out of non-essential communications.</p>
          </li>

          <li>
            <strong>Children’s Privacy:</strong>
            <p>Our Services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </li>

          <li>
            <strong>International Users:</strong>
            <p>If you are located outside the United States, please be aware that your information may be transferred to and processed in the United States.</p>
          </li>

          <li>
            <strong>Changes to this Privacy Policy:</strong>
            <p>We may update this Privacy Policy periodically. We encourage you to review it regularly.</p>
          </li>

          <li>
            <strong>Contact Us:</strong>
            <p>If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:ReadRacerHelp@gmail.com" className="text-blue-600 underline">readracerhelp@gmail.com</a>.</p>
          </li>
        </ol>

        <p className="mt-6 text-gray-700 font-semibold">
          By using our Services, you consent to the collection and use of information as described in this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
