const NavBar = ({ onNavigate, user, onLogin, activePage }) => {
  const buttonClass = (page) =>
    `px-4 py-2 rounded-xl transition font-medium ${
      activePage === page
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-4 py-3 flex justify-between items-center z-50">
      <div
        className="text-xl font-bold text-gray-800 cursor-pointer"
        onClick={() => onNavigate('home')}
      >
        📘 Read Racer
      </div>

      <div className="flex gap-4 items-center relative">
        <button onClick={() => onNavigate('home')} className={buttonClass('home')}>
          Home
        </button>
        <button onClick={() => onNavigate('faq')} className={buttonClass('faq')}>
          FAQ
        </button>
        <button onClick={() => onNavigate('results')} className={buttonClass('results')}>
          Results
        </button>

        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name || 'Profile'}
            title={user.name || 'Your profile'}
            onClick={() => onNavigate('profile')}
            className={`w-10 h-10 rounded-full cursor-pointer border ${
              activePage === 'profile' ? 'ring-2 ring-blue-500' : 'border-gray-300 hover:ring-2 hover:ring-blue-500'
            } transition`}
          />
        ) : (
          <div className="relative group">
            <button
              onClick={onLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Sign In with Google
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black bg-opacity-80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 w-52 text-center">
              Required to prevent bots from submitting fake results
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
