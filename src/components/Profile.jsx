import React, { useState, useEffect} from "react";

const Profile = ({ user, setUser, onLogout, onBackHome, setPage }) => {
  const [stats, setStats] = useState({
    totalExperiments: 0,
    summaryExperiments: 0,
    fullPassageExperiments: 0,
    dateJoined: "2024-01-15",
  });

  const [displayName, setDisplayName] = useState("");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true); // Default is opt-in
  const [saveMessage, setSaveMessage] = useState("");

  // Update display name and opt-in on user change
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setLeaderboardOptIn(
        user.leaderboardOptIn === undefined ? true : !!user.leaderboardOptIn
      );
      setStats({
        totalExperiments: user.totalExperiments || 0,
        summaryExperiments: user.summaryExperiments || 0,
        fullPassageExperiments: user.fullPassageExperiments || 0,
        dateJoined: user.dateJoined || "2024-01-15",
      });
    }
  }, [user]);

  // Refresh from backend when profile loads
  useEffect(() => {
    async function refreshStats() {
      if (!user?.email) return;

      try {
        const res = await fetch("https://read-racer.azurewebsites.net/api/getUserProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const updatedProfile = await res.json();

        const updatedUser = {
          ...user,
          displayName: updatedProfile.displayName || user.displayName,
          leaderboardOptIn:
            updatedProfile.leaderboardOptIn === undefined
              ? true
              : updatedProfile.leaderboardOptIn,
          totalExperiments: updatedProfile.totalExperiments ?? 0,
          summaryExperiments: updatedProfile.summaryExperiments ?? 0,
          fullPassageExperiments: updatedProfile.fullPassageExperiments ?? 0,
          dateJoined: updatedProfile.dateJoined || user.dateJoined,
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setStats({
          totalExperiments: updatedUser.totalExperiments,
          summaryExperiments: updatedUser.summaryExperiments,
          fullPassageExperiments: updatedUser.fullPassageExperiments,
          dateJoined: updatedUser.dateJoined,
        });
      } catch (err) {
        console.error("[Profile] Failed to refresh profile stats:", err);
      }
    }

    refreshStats();
  }, [user?.email]);

  useEffect(() => {
    if (saveMessage) {
      const timeout = setTimeout(() => setSaveMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [saveMessage]);

  const handleDisplayNameChange = (e) => setDisplayName(e.target.value);
  const handleLeaderboardChange = (e) => setLeaderboardOptIn(e.target.checked);

  const saveProfile = async () => {
    if (!user) return;

    const trimmedDisplayName = displayName.trim();

    const updatedUser = {
      ...user,
      displayName: trimmedDisplayName,
      leaderboardOptIn,
      totalExperiments: stats.totalExperiments,
      summaryExperiments: stats.summaryExperiments,
      fullPassageExperiments: stats.fullPassageExperiments,
      dateJoined: stats.dateJoined,
    };

    try {
      const res = await fetch("https://read-racer.azurewebsites.net/api/setUserProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          uuid: user.uuid,
          displayName: trimmedDisplayName,
          leaderboardOptIn,
          totalExperiments: stats.totalExperiments,
          summaryExperiments: stats.summaryExperiments,
          fullPassageExperiments: stats.fullPassageExperiments,
          dateJoined: stats.dateJoined,
        }),
      });

      if (!res.ok) {
        setSaveMessage("Save failed.");
        console.error("[Profile] Failed to save profile, status:", res.status);
        return;
      }

      const result = await res.json();

      if (result.success) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSaveMessage("Saved!");
      } else {
        setSaveMessage("Save failed.");
      }
    } catch (err) {
      console.error("[Profile] Failed to save profile:", err);
      setSaveMessage("Save failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Profile</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">User Info</h2>
          <label className="block mb-2 font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={handleDisplayNameChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            placeholder="Your display name"
          />

          <div className="mt-4">
            <label className="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={leaderboardOptIn}
                onChange={handleLeaderboardChange}
                className="form-checkbox h-5 w-5 rounded"
                style={{ accentColor: "#2563eb" }}
              />
              <span className="ml-2 text-gray-700">
                Opt-in to Leaderboard
                <span className="ml-1 text-sm text-gray-500">(enabled by default)</span>
              </span>
            </label>
          </div>

          <div className="mt-4">
            <button
              onClick={saveProfile}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Save
            </button>
          </div>

          {saveMessage && (
            <p className={`mt-2 font-semibold ${saveMessage === "Saved!" ? "text-green-600" : "text-red-600"}`}>
              {saveMessage}
            </p>
          )}

          <p className="mt-6 text-gray-600"><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p className="mt-1 text-gray-600"><strong>User ID:</strong> <span className="font-mono">{user?.uuid}</span></p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Statistics</h2>
          <ul className="space-y-2 text-gray-700">
            <li>Total Experiments Taken: <span className="font-semibold">{stats.totalExperiments}</span></li>
            <li>Summary Experiments: <span className="font-semibold">{stats.summaryExperiments}</span></li>
            <li>Full Passage Experiments: <span className="font-semibold">{stats.fullPassageExperiments}</span></li>
            <li>Date Joined: <span className="font-semibold">{new Date(stats.dateJoined).toLocaleDateString()}</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Legal</h2>
          <ul className="space-y-2 text-blue-600 underline cursor-pointer">
          <li onClick={() => setPage('terms')} className="cursor-pointer hover:underline">Terms of Service</li>
          <li onClick={() => setPage('privacy')} className="cursor-pointer hover:underline">Privacy Policy</li>
          </ul>
        </section>

        <div className="flex gap-4">
          <button
            onClick={onLogout}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Log Out
          </button>
          <button
            onClick={onBackHome}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
